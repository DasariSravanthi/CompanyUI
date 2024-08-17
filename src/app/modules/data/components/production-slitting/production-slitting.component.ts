import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ConfirmationService } from 'primeng/api';
import { ProductionSlitting } from '../../../../../types';

@Component({
  selector: 'app-production-slitting',
  templateUrl: './production-slitting.component.html',
  styleUrl: './production-slitting.component.scss'
})
export class ProductionSlittingComponent {
  constructor(private apiService: ApiService, private confirmationService: ConfirmationService) {}

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
    this.apiService.get<ProductionSlitting[]>(`${this.url}/allProductionSlittings`).subscribe({
      next: (productionSlittings: ProductionSlitting[]) => {
        this.productionSlittings = productionSlittings;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  addProductionSlitting(productionSlitting: ProductionSlitting) {
    this.apiService.post<ProductionSlitting>(`${this.url}/addProductionSlitting`, productionSlitting).subscribe({
      next: (productionSlitting: ProductionSlitting) => {
        this.getAllProductionSlittings();
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  updateProductionSlitting(id: number, productionSlitting: ProductionSlitting) {
    this.apiService.put<ProductionSlitting>(`${this.url}/updateProductionSlitting/${id}`, productionSlitting).subscribe({
      next: (productionSlitting: ProductionSlitting) => {
        this.getAllProductionSlittings();
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  deleteProductionSlitting(id: number) {
    this.apiService.delete<ProductionSlitting>(`${this.url}/deleteProductionSlitting/${id}`).subscribe({
      next: (productionSlitting: ProductionSlitting) => {
        this.getAllProductionSlittings();
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

}
