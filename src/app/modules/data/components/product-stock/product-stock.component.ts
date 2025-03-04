import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProductDetail, ProductStock } from '../../../../../types';
import { environment } from '../../../../../environments/environment.development';

@Component({
  selector: 'app-product-stock',
  templateUrl: './product-stock.component.html',
  styleUrl: './product-stock.component.scss'
})
export class ProductStockComponent {
  constructor(private apiService: ApiService, private confirmationService: ConfirmationService, private messageService: MessageService) {}

  private url = environment.apiUrl;

  productStocks: ProductStock[] = [];

  displayEditPopup: boolean = false;
  displayAddPopup: boolean = false;
  
  selectedProductStock: ProductStock = {
    productStockId: 0,
    productDetailId: 0,
    variant: '',
    gsm: 0,
    sizeId: 0,
    sizeInMM: 0,
    weightInKgs: 0,
    rollCount: 0
  };

  productDetails: ProductDetail[] = []; // List of product details to display in the dropdown
  filteredProductStocks: ProductStock[] = []; // Product Stocks to display in the table
  selectedProductDetailId: number | undefined = undefined; // Selected product detail ID in dropdown

  toggleEditPopup(productStock: ProductStock) {
    this.selectedProductStock = { ...productStock };
    this.displayEditPopup = true;
  }

  toggleDeleteDialog(productStock: ProductStock) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this productStock?',
      accept: () => {
        this.onConfirmDelete(productStock);
      }
    });
  }

  toggleAddPopup() {
    this.displayAddPopup = true;
  }

  onConfirmEdit(productStock: ProductStock) {
    if (!this.selectedProductStock.productStockId) {
      return;
    }

    this.updateProductStock(this.selectedProductStock.productStockId, productStock);
    this.displayEditPopup = false;
  }

  onConfirmDelete(productStock: ProductStock) {
    if (!productStock.productStockId) {
      return;
    }

    this.deleteProductStock(productStock.productStockId);
  }

  onConfirmAdd(productStock: ProductStock) {
    this.addProductStock(productStock);
    this.displayAddPopup = false;
  }

  ngOnInit() {
    this.getAllProductStocks(() => this.getAllProductDetails());
  }

  getAllProductStocks(callback: () => void) {
    this.messageService.clear();

    this.apiService.get<ProductStock[]>(`${this.url}/ProductStock/allProductStocks`).subscribe({
      next: (productStocks: ProductStock[]) => {
        this.productStocks = productStocks;
        
        callback();
      },
      error: (error) => {
        const errorMessage = error.error || 'An unexpected error occurred.';
        this.messageService.add({ severity: 'error', summary: 'Failure Error', detail: errorMessage });
      }
    });
  }

  addProductStock(productStock: ProductStock) {
    this.messageService.clear();

    this.apiService.post<ProductStock>(`${this.url}/ProductStock/addProductStock`, productStock).subscribe({
      next: (productStock: ProductStock) => {
        this.getAllProductStocks(() => this.getAllProductDetails());
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

  updateProductStock(id: number, productStock: ProductStock) {
    this.messageService.clear();

    this.apiService.put<ProductStock>(`${this.url}/ProductStock/updateProductStock/${id}`, productStock).subscribe({
      next: (productStock: ProductStock) => {
        this.getAllProductStocks(() => this.getAllProductDetails());
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

  deleteProductStock(id: number) {
    this.messageService.clear();

    this.apiService.delete<ProductStock>(`${this.url}/ProductStock/deleteProductStock/${id}`).subscribe({
      next: (productStock: ProductStock) => {
        this.getAllProductStocks(() => this.getAllProductDetails());
      },
      error: (error) => {
        const errorMessage = error.error || 'An unexpected error occurred.';
        this.messageService.add({ severity: 'error', summary: 'Failure Error', detail: errorMessage });
      }
    });
  }

  getAllProductDetails() {
    this.messageService.clear();

    this.apiService.get<ProductDetail[]>(`${this.url}/ProductDetail/allProductDetails`).subscribe({
      next: (productDetails: ProductDetail[]) => {
        this.productDetails = [...productDetails, { productDetailId: undefined, productId: 0, productCategory: '', variant: 'All' }];
        
        // Set the default selection to the first actual product detail
        this.selectedProductDetailId = this.productDetails[0]?.productDetailId;

        this.filteredProductStocks = this.productStocks.filter(
          stock => stock.productDetailId === this.selectedProductDetailId
        );

      },
      error: (error) => {
        const errorMessage = error.error || 'An unexpected error occurred.';
        this.messageService.add({ severity: 'error', summary: 'Failure Error', detail: errorMessage });
      }
    });
  }

  onVariantChange(selectedProductDetailId?: number) {
    if (selectedProductDetailId === undefined) {
      // Show all product stocks if "All" is selected
      this.filteredProductStocks = this.productStocks;
    } else {
      // Filter product stocks based on the selected productDetailId
      this.filteredProductStocks = this.productStocks.filter(
        stock => stock.productDetailId === selectedProductDetailId
      );
    }
  }

}
