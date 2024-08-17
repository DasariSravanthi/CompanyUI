import { Component, ElementRef, ViewChild } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ConfirmationService } from 'primeng/api';
import { Product } from '../../../../../types';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent {
  constructor(private apiService: ApiService, private confirmationService: ConfirmationService) {}

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
    this.apiService.get<Product[]>(`${this.url}/allProducts`).subscribe({
      next: (products: Product[]) => {
        this.products = products;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  getProductById(id: number) {
    this.apiService.get<Product>(`${this.url}/getProduct/${id}`).subscribe({
      next: (product: Product) => {
        console.log(product);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  addProduct(product: Product) {
    this.apiService.post<Product>(`${this.url}/addProduct`, product).subscribe({
      next: (product: Product) => {
        this.getAllProducts();
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  updateProduct(id: number, product: Product) {
    this.apiService.put<Product>(`${this.url}/updateProduct/${id}`, product).subscribe({
      next: (product: Product) => {
        this.getAllProducts();
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  deleteProduct(id: number) {
    this.apiService.delete<Product>(`${this.url}/deleteProduct/${id}`).subscribe({
      next: (product: Product) => {
        this.getAllProducts();
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

}
