import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProductionSlitting } from '../../../../../types';

@Component({
  selector: 'app-production-slitting',
  templateUrl: './production-slitting.component.html',
  styleUrl: './production-slitting.component.scss'
})
export class ProductionSlittingComponent {
  constructor(private apiService: ApiService, private confirmationService: ConfirmationService, private messageService: MessageService) {}

  private url = 'http://localhost:5110/ProductionSlitting';

  productionSlittings: ProductionSlitting[] = [];

  displayEditPopup: boolean = false;
  displayAddPopup: boolean = false;
  
  selectedProductionSlitting: ProductionSlitting = {
    productionSlittingId: 0,
    productionCoatingDate: '',
    productionCalendaringId: 0,
    rollNumber: '',
    beforeWeight: 0,
    beforeMoisture: 0,
    slittingStart: '',
    slittingEnd: '',
    rollCount: 0
  };

  toggleEditPopup(productionSlitting: ProductionSlitting) {
    this.selectedProductionSlitting = { ...productionSlitting };
    this.displayEditPopup = true;
  }

  toggleDeleteDialog(productionSlitting: ProductionSlitting) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this productionSlitting?',
      accept: () => {
        this.onConfirmDelete(productionSlitting);
      }
    });
  }

  toggleAddPopup() {
    this.displayAddPopup = true;
  }

  onConfirmEdit(productionSlitting: ProductionSlitting) {
    if (!this.selectedProductionSlitting.productionSlittingId) {
      return;
    }

    this.updateProductionSlitting(this.selectedProductionSlitting.productionSlittingId, productionSlitting);
    this.displayEditPopup = false;
  }

  onConfirmDelete(productionSlitting: ProductionSlitting) {
    if (!productionSlitting.productionSlittingId) {
      return;
    }

    this.deleteProductionSlitting(productionSlitting.productionSlittingId);
  }

  onConfirmAdd(productionSlitting: ProductionSlitting) {
    this.addProductionSlitting(productionSlitting);
    this.displayAddPopup = false;
  }

  ngOnInit() {
    this.getAllProductionSlittings();
  }

  getAllProductionSlittings() {
    this.messageService.clear();

    this.apiService.get<ProductionSlitting[]>(`${this.url}/allProductionSlittings`).subscribe({
      next: (productionSlittings: ProductionSlitting[]) => {
        this.productionSlittings = productionSlittings;
      },
      error: (error) => {
        const errorMessage = error.error || 'An unexpected error occurred.';
        this.messageService.add({ severity: 'error', summary: 'Failure Error', detail: errorMessage });
      }
    });
  }

  addProductionSlitting(productionSlitting: ProductionSlitting) {
    this.messageService.clear();

    this.apiService.post<ProductionSlitting>(`${this.url}/addProductionSlitting`, productionSlitting).subscribe({
      next: (productionSlitting: ProductionSlitting) => {
        this.getAllProductionSlittings();
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

  updateProductionSlitting(id: number, productionSlitting: ProductionSlitting) {
    this.messageService.clear();

    this.apiService.put<ProductionSlitting>(`${this.url}/updateProductionSlitting/${id}`, productionSlitting).subscribe({
      next: (productionSlitting: ProductionSlitting) => {
        this.getAllProductionSlittings();
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

  deleteProductionSlitting(id: number) {
    this.messageService.clear();

    this.apiService.delete<ProductionSlitting>(`${this.url}/deleteProductionSlitting/${id}`).subscribe({
      next: (productionSlitting: ProductionSlitting) => {
        this.getAllProductionSlittings();
      },
      error: (error) => {
        const errorMessage = error.error || 'An unexpected error occurred.';
        this.messageService.add({ severity: 'error', summary: 'Failure Error', detail: errorMessage });
      }
    });
  }

}
