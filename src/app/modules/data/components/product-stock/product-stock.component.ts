import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ConfirmationService } from 'primeng/api';
import { ProductStock } from '../../../../../types';

@Component({
  selector: 'app-product-stock',
  templateUrl: './product-stock.component.html',
  styleUrl: './product-stock.component.scss'
})
export class ProductStockComponent {
  constructor(private apiService: ApiService, private confirmationService: ConfirmationService) {}

  private url = 'http://localhost:5110/ProductStock';

  productStocks: ProductStock[] = [];

  displayEditPopup: boolean = false;
  displayAddPopup: boolean = false;
  
  selectedProductStock: ProductStock = {
    productDetailId: 0,
    gsm: 0,
    sizeId: 0,
    weightInKgs: 0,
    rollCount: 0
  };

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
    this.getAllProductStocks();
  }

  getAllProductStocks() {
    this.apiService.get<ProductStock[]>(`${this.url}/allProductStocks`).subscribe({
      next: (productStocks: ProductStock[]) => {
        this.productStocks = productStocks;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  addProductStock(productStock: ProductStock) {
    this.apiService.post<ProductStock>(`${this.url}/addProductStock`, productStock).subscribe({
      next: (productStock: ProductStock) => {
        this.getAllProductStocks();
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  updateProductStock(id: number, productStock: ProductStock) {
    this.apiService.put<ProductStock>(`${this.url}/updateProductStock/${id}`, productStock).subscribe({
      next: (productStock: ProductStock) => {
        this.getAllProductStocks();
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  deleteProductStock(id: number) {
    this.apiService.delete<ProductStock>(`${this.url}/deleteProductStock/${id}`).subscribe({
      next: (productStock: ProductStock) => {
        this.getAllProductStocks();
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

}
