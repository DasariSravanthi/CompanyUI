import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Product, ProductDetail } from '../../../../../types';
import { environment } from '../../../../../environments/environment.development';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent {
  constructor(private apiService: ApiService, private confirmationService: ConfirmationService, private messageService: MessageService) {}

  private url = environment.apiUrl;

  productDetails: ProductDetail[] = [];

  displayEditPopup: boolean = false;
  displayAddPopup: boolean = false;
  
  selectedProductDetail: ProductDetail = {
    productDetailId: 0,
    productId: 0,
    productCategory: '',
    variant: '',
  };

  products: Product[] = []; // List of products to display in the dropdown
  filteredVariants: ProductDetail[] = []; // Product Details to display in the table
  selectedProductId: number | undefined = undefined; // Selected product ID in dropdown

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
    this.getAllProductDetails(() => this.getAllProducts());
  }

  getAllProductDetails(callback: () => void) {
    this.messageService.clear();

    this.apiService.get<ProductDetail[]>(`${this.url}/ProductDetail/allProductDetails`).subscribe({
      next: (productDetails: ProductDetail[]) => {
        this.productDetails = productDetails;

        callback();
      },
      error: (error) => {
        const errorMessage = error.error || 'An unexpected error occurred.';
        this.messageService.add({ severity: 'error', summary: 'Failure Error', detail: errorMessage });
      }
    });
  }

  addProductDetail(productDetail: ProductDetail) {
    this.messageService.clear();
    
    this.apiService.post<ProductDetail>(`${this.url}/ProductDetail/addProductDetail`, productDetail).subscribe({
      next: (productDetail: ProductDetail) => {
        this.getAllProductDetails(() => this.getAllProducts());
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

  updateProductDetail(id: number, productDetail: ProductDetail) {
    this.messageService.clear();
    
    this.apiService.put<ProductDetail>(`${this.url}/ProductDetail/updateProductDetail/${id}`, productDetail).subscribe({
      next: (productDetail: ProductDetail) => {
        this.getAllProductDetails(() => this.getAllProducts());
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

  deleteProductDetail(id: number) {
    this.messageService.clear();
    
    this.apiService.delete<ProductDetail>(`${this.url}/ProductDetail/deleteProductDetail/${id}`).subscribe({
      next: (productDetail: ProductDetail) => {
        this.getAllProductDetails(() => this.getAllProducts());
      },
      error: (error) => {
        const errorMessage = error.error || 'An unexpected error occurred.';
        this.messageService.add({ severity: 'error', summary: 'Failure Error', detail: errorMessage });
      }
    });
  }

  getAllProducts() {
    this.messageService.clear();

    this.apiService.get<Product[]>(`${this.url}/Product/allProducts`).subscribe({
      next: (products: Product[]) => {
        this.products = [...products, { productId: undefined, productCategory: 'All' }];

        // Set the default selection to the first actual product
        this.selectedProductId = this.products[0]?.productId;

        this.filteredVariants = this.productDetails.filter(
          detail => detail.productId === this.selectedProductId
        );

      },
      error: (error) => {
        const errorMessage = error.error || 'An unexpected error occurred.';
        this.messageService.add({ severity: 'error', summary: 'Failure Error', detail: errorMessage });
      }
    });
  }

  onProductCategoryChange(selectedProductId?: number) {
    if (selectedProductId === undefined) {
      // Show all product details if "All" is selected
      this.filteredVariants = this.productDetails;
    } else {
      // Filter product details based on the selected productId
      this.filteredVariants = this.productDetails.filter(
        detail => detail.productId === selectedProductId
      );
    }
  }

}
