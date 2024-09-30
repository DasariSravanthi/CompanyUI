import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProductionCoating } from '../../../../../types';
import { environment } from '../../../../../environments/environment.development';

@Component({
  selector: 'app-production-coating',
  templateUrl: './production-coating.component.html',
  styleUrl: './production-coating.component.scss'
})
export class ProductionCoatingComponent {
  constructor(private apiService: ApiService, private confirmationService: ConfirmationService, private messageService: MessageService) {}

  private url = environment.apiUrl;

  productionCoatings: ProductionCoating[] = [];

  displayEditPopup: boolean = false;
  displayAddPopup: boolean = false;
  
  selectedProductionCoating: ProductionCoating = {
    productionCoatingId: 0,
    productionCoatingDate: '',
    issueId: 0,
    coatingStart: '',
    coatingEnd: '',
    averageSpeed: 0,
    averageTemperature: 0,
    gsmCoated: 0,
    rollCount: 0
  };

  toggleEditPopup(productionCoating: ProductionCoating) {
    this.selectedProductionCoating = { ...productionCoating };
    this.displayEditPopup = true;
  }

  toggleDeleteDialog(productionCoating: ProductionCoating) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this productionCoating?',
      accept: () => {
        this.onConfirmDelete(productionCoating);
      }
    });
  }

  toggleAddPopup() {
    this.displayAddPopup = true;
  }

  onConfirmEdit(productionCoating: ProductionCoating) {
    if (!this.selectedProductionCoating.productionCoatingId) {
      return;
    }

    this.updateProductionCoating(this.selectedProductionCoating.productionCoatingId, productionCoating);
    this.displayEditPopup = false;
  }

  onConfirmDelete(productionCoating: ProductionCoating) {
    if (!productionCoating.productionCoatingId) {
      return;
    }

    this.deleteProductionCoating(productionCoating.productionCoatingId);
  }

  onConfirmAdd(productionCoating: ProductionCoating) {
    this.addProductionCoating(productionCoating);
    this.displayAddPopup = false;
  }

  ngOnInit() {
    this.getAllProductionCoatings();
  }

  getAllProductionCoatings() {
    this.messageService.clear();

    this.apiService.get<ProductionCoating[]>(`${this.url}/ProductionCoating/allProductionCoatings`).subscribe({
      next: (productionCoatings: ProductionCoating[]) => {
        this.productionCoatings = productionCoatings;
      },
      error: (error) => {
        const errorMessage = error.error || 'An unexpected error occurred.';
        this.messageService.add({ severity: 'error', summary: 'Failure Error', detail: errorMessage });
      }
    });
  }

  addProductionCoating(productionCoating: ProductionCoating) {
    this.messageService.clear();

    this.apiService.post<ProductionCoating>(`${this.url}/ProductionCoating/addProductionCoating`, productionCoating).subscribe({
      next: (productionCoating: ProductionCoating) => {
        this.getAllProductionCoatings();
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

  updateProductionCoating(id: number, productionCoating: ProductionCoating) {
    this.messageService.clear();

    this.apiService.put<ProductionCoating>(`${this.url}/ProductionCoating/updateProductionCoating/${id}`, productionCoating).subscribe({
      next: (productionCoating: ProductionCoating) => {
        this.getAllProductionCoatings();
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

  deleteProductionCoating(id: number) {
    this.messageService.clear();

    this.apiService.delete<ProductionCoating>(`${this.url}/ProductionCoating/deleteProductionCoating/${id}`).subscribe({
      next: (productionCoating: ProductionCoating) => {
        this.getAllProductionCoatings();
      },
      error: (error) => {
        const errorMessage = error.error || 'An unexpected error occurred.';
        this.messageService.add({ severity: 'error', summary: 'Failure Error', detail: errorMessage });
      }
    });
  }

}
