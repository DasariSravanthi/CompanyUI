import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ConfirmationService } from 'primeng/api';
import { ProductDetail } from '../../../../../types';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent {
  constructor(private apiService: ApiService, private confirmationService: ConfirmationService) {}

  private url = 'http://localhost:5110/ProductDetail';

  productDetails: ProductDetail[] = [];

  displayEditPopup: boolean = false;
  displayAddPopup: boolean = false;
  
  selectedProductDetail: ProductDetail = {
    productDetailId: 0,
    productId: 0,
    variant: '',
    products: []
  };

  toggleEditPopup(productDetail: ProductDetail) {
    this.selectedProductDetail = { ...productDetail };
    this.displayEditPopup = true;
  }

  toggleDeleteDialog(productDetail: ProductDetail) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this productDetail?',
      accept: () => {
        this.onConfirmDelete(productDetail);
      }
    });
  }

  toggleAddPopup() {
    this.displayAddPopup = true;
  }

  onConfirmEdit(productDetail: ProductDetail) {
    if (!this.selectedProductDetail.productDetailId) {
      return;
    }

    this.updateProductDetail(this.selectedProductDetail.productDetailId, productDetail);
    this.displayEditPopup = false;
  }

  onConfirmDelete(productDetail: ProductDetail) {
    if (!productDetail.productDetailId) {
      return;
    }

    this.deleteProductDetail(productDetail.productDetailId);
  }

  onConfirmAdd(productDetail: ProductDetail) {
    this.addProductDetail(productDetail);
    this.displayAddPopup = false;
  }

  ngOnInit() {
    this.getAllProductDetails();
  }

  getAllProductDetails() {
    this.apiService.get<ProductDetail[]>(`${this.url}/allProductDetails`).subscribe({
      next: (productDetails: ProductDetail[]) => {
        this.productDetails = productDetails;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  addProductDetail(productDetail: ProductDetail) {
    this.apiService.post<ProductDetail>(`${this.url}/addProductDetail`, productDetail).subscribe({
      next: (productDetail: ProductDetail) => {
        this.getAllProductDetails();
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  updateProductDetail(id: number, productDetail: ProductDetail) {
    this.apiService.put<ProductDetail>(`${this.url}/updateProductDetail/${id}`, productDetail).subscribe({
      next: (productDetail: ProductDetail) => {
        this.getAllProductDetails();
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  deleteProductDetail(id: number) {
    this.apiService.delete<ProductDetail>(`${this.url}/deleteProductDetail/${id}`).subscribe({
      next: (productDetail: ProductDetail) => {
        this.getAllProductDetails();
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

}
