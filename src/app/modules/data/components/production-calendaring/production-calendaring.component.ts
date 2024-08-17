import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ConfirmationService } from 'primeng/api';
import { ProductionCalendaring } from '../../../../../types';

@Component({
  selector: 'app-production-calendaring',
  templateUrl: './production-calendaring.component.html',
  styleUrl: './production-calendaring.component.scss'
})
export class ProductionCalendaringComponent {
  constructor(private apiService: ApiService, private confirmationService: ConfirmationService) {}

  private url = 'http://localhost:5110/ProductionCalendaring';

  productionCalendarings: ProductionCalendaring[] = [];

  displayEditPopup: boolean = false;
  displayAddPopup: boolean = false;
  
  selectedProductionCalendaring: ProductionCalendaring = {
    productionCalendaringId: 0,
    productionCoatingDate: '',
    productionCoatingId: 0,
    rollNumber: '',
    beforeWeight: 0,
    beforeMoisture: 0,
    calendaringStart: '',
    calendaringEnd: '',
    rollCount: 0
  };

  toggleEditPopup(productionCalendaring: ProductionCalendaring) {
    this.selectedProductionCalendaring = { ...productionCalendaring };
    this.displayEditPopup = true;
  }

  toggleDeleteDialog(productionCalendaring: ProductionCalendaring) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this productionCalendaring?',
      accept: () => {
        this.onConfirmDelete(productionCalendaring);
      }
    });
  }

  toggleAddPopup() {
    this.displayAddPopup = true;
  }

  onConfirmEdit(productionCalendaring: ProductionCalendaring) {
    if (!this.selectedProductionCalendaring.productionCalendaringId) {
      return;
    }

    this.updateProductionCalendaring(this.selectedProductionCalendaring.productionCalendaringId, productionCalendaring);
    this.displayEditPopup = false;
  }

  onConfirmDelete(productionCalendaring: ProductionCalendaring) {
    if (!productionCalendaring.productionCalendaringId) {
      return;
    }

    this.deleteProductionCalendaring(productionCalendaring.productionCalendaringId);
  }

  onConfirmAdd(productionCalendaring: ProductionCalendaring) {
    this.addProductionCalendaring(productionCalendaring);
    this.displayAddPopup = false;
  }

  ngOnInit() {
    this.getAllProductionCalendarings();
  }

  getAllProductionCalendarings() {
    this.apiService.get<ProductionCalendaring[]>(`${this.url}/allProductionCalendarings`).subscribe({
      next: (productionCalendarings: ProductionCalendaring[]) => {
        this.productionCalendarings = productionCalendarings;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  addProductionCalendaring(productionCalendaring: ProductionCalendaring) {
    this.apiService.post<ProductionCalendaring>(`${this.url}/addProductionCalendaring`, productionCalendaring).subscribe({
      next: (productionCalendaring: ProductionCalendaring) => {
        this.getAllProductionCalendarings();
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  updateProductionCalendaring(id: number, productionCalendaring: ProductionCalendaring) {
    this.apiService.put<ProductionCalendaring>(`${this.url}/updateProductionCalendaring/${id}`, productionCalendaring).subscribe({
      next: (productionCalendaring: ProductionCalendaring) => {
        this.getAllProductionCalendarings();
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  deleteProductionCalendaring(id: number) {
    this.apiService.delete<ProductionCalendaring>(`${this.url}/deleteProductionCalendaring/${id}`).subscribe({
      next: (productionCalendaring: ProductionCalendaring) => {
        this.getAllProductionCalendarings();
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

}
