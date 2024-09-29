import { Component, ElementRef, ViewChild } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Product } from '../../../../../types';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent {
  constructor(private apiService: ApiService, private confirmationService: ConfirmationService, private messageService: MessageService) {}

  @ViewChild('deleteButton') deleteButton!: ElementRef;
  
  private url = 'http://localhost:5110/Product';

  products: Product[] = [];

  displayEditPopup: boolean = false;
  displayAddPopup: boolean = false;

  selectedProduct: Product = {
    productId: 0,
    productCategory: ''
  };

  toggleEditPopup(product: Product) {
    this.selectedProduct = { ...product };
    this.displayEditPopup = true;
  }

  toggleDeleteDialog(product: Product) {
    this.confirmationService.confirm({
      target: this.deleteButton.nativeElement,
      message: 'Are you sure that you want to delete this product?',
      accept: () => {
        this.onConfirmDelete(product);
      }
    });
  }

  // displayConfirmDialog = false;
  // dialogPosition = { top: 0, left: 0 };

  // toggleDeleteDialog(product: Product, event: MouseEvent) {
  //   const buttonElement = event.target as HTMLElement;
  //   const rect = buttonElement.getBoundingClientRect();

  //   this.dialogPosition.top = rect.top + window.scrollY + rect.height;
  //   this.dialogPosition.left = rect.left + window.scrollX;

  //   this.displayConfirmDialog = true;
  // }

  toggleAddPopup() {
    this.displayAddPopup = true;
  }

  onConfirmEdit(product: Product) {
    if (!this.selectedProduct.productId) {
      return;
    }

    this.updateProduct(this.selectedProduct.productId, product);
    this.displayEditPopup = false;
  }

  onConfirmDelete(product: Product) {
    if (!product.productId) {
      return;
    }

    this.deleteProduct(product.productId);
  }
  
  onConfirmAdd(product: Product) {
    this.addProduct(product);
    this.displayAddPopup = false;
  }

  ngOnInit() {
    this.getAllProducts();
  }

  getAllProducts() {
    // Clear messages before making this API call
    this.messageService.clear();

    this.apiService.get<Product[]>(`${this.url}/allProducts`).subscribe({
      next: (products: Product[]) => {
        this.products = products;
      },
      error: (error) => {
        const errorMessage = error.error || 'An unexpected error occurred.';
        this.messageService.add({ severity: 'error', summary: 'Failure Error', detail: errorMessage });
      }
    });
  }

  getProductById(id: number) {
    this.messageService.clear();

    this.apiService.get<Product>(`${this.url}/getProduct/${id}`).subscribe({
      next: (product: Product) => {
        console.log(product);
      },
      error: (error) => {
        const errorMessage = error.error || 'An unexpected error occurred.';
        this.messageService.add({ severity: 'error', summary: 'Failure Error', detail: errorMessage });
      }
    });
  }

  addProduct(product: Product) {
    this.messageService.clear();

    this.apiService.post<Product>(`${this.url}/addProduct`, product).subscribe({
      next: (product: Product) => {
        this.getAllProducts();
      },
      error: (error) => {
        if (error.status === 400 && error.error?.errors) {
          // Extract the validation errors
          const validationErrors = error.error.errors;

          // Display validation messages for each field
          Object.keys(validationErrors).forEach(field => {
            validationErrors[field].forEach((message: string) => {
              this.messageService.add({ severity: 'error', summary: 'Validation Error', detail: `${field}: ${message}` });
            });
          });
        } else {
          // Handle other error cases
          const errorMessage = error.error || 'An unexpected error occurred.';
          this.messageService.add({ severity: 'error', summary: 'Failure Error', detail: errorMessage });
        }
      }
    });
  }

  updateProduct(id: number, product: Product) {
    this.messageService.clear();

    this.apiService.put<Product>(`${this.url}/updateProduct/${id}`, product).subscribe({
      next: (product: Product) => {
        this.getAllProducts();
      },
      error: (error) => {
        if (error.status === 400 && error.error?.errors) {
          const validationErrors = error.error.errors;

          Object.keys(validationErrors).forEach(field => {
            validationErrors[field].forEach((message: string) => {
              this.messageService.add({ severity: 'error', summary: 'Validation Error', detail: `${field}: ${message}` });
            });
          });
        } else {
          const errorMessage = error.error || 'An unexpected error occurred.';
          this.messageService.add({ severity: 'error', summary: 'Failure Error', detail: errorMessage });
        }
      }
    });
  }

  deleteProduct(id: number) {
    this.messageService.clear();

    this.apiService.delete<Product>(`${this.url}/deleteProduct/${id}`).subscribe({
      next: (product: Product) => {
        this.getAllProducts();
      },
      error: (error) => {
        const errorMessage = error.error || 'An unexpected error occurred.';
        this.messageService.add({ severity: 'error', summary: 'Failure Error', detail: errorMessage });
      }
    });
  }

}
