import { Component, ElementRef, ViewChild } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Product } from '../../../../../types';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent {
  constructor(private apiService: ApiService, private confirmationService: ConfirmationService) {}

  @ViewChild('deleteButton') deleteButton: any;

  private url = 'http://localhost:5110/Product';

  products: Product[] = [];

  displayEditPopup: boolean = false;
  displayAddPopup: boolean = false;

  selectedProduct: Product = {
    productId: 0,
    productCategory: ''
  };

  toggleEditPopup(product: Product) {
    this.selectedProduct = product;
    this.displayEditPopup = true;
  }

  toggleDeletePopup(product: Product) {
    if (!product.productId) {
      return;
    }

    this.deleteProduct(product.productId);
  }

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
    this.confirmationService.confirm({
      target: this.deleteButton.nativeElement,
      message: 'Are you sure that you want to delete this product?',
      accept: () => {
        this.toggleDeletePopup(product);
      },
    });
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
