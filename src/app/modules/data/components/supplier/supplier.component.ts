import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Supplier } from '../../../../../types';
import { environment } from '../../../../../environments/environment.development';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrl: './supplier.component.scss'
})
export class SupplierComponent {
  constructor(private apiService: ApiService, private confirmationService: ConfirmationService, private messageService: MessageService) {}

  private url = environment.apiUrl;

  suppliers: Supplier[] = [];

  displayEditPopup: boolean = false;
  displayAddPopup: boolean = false;
  
  selectedSupplier: Supplier = {
    supplierId: 0,
    supplierName: '',
    dues: 0
  };

  toggleEditPopup(supplier: Supplier) {
    this.selectedSupplier = { ...supplier };
    this.displayEditPopup = true;
  }

  toggleDeleteDialog(supplier: Supplier) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this supplier?',
      accept: () => {
        this.onConfirmDelete(supplier);
      }
    });
  }

  toggleAddPopup() {
    this.displayAddPopup = true;
  }

  onConfirmEdit(supplier: Supplier) {
    if (!this.selectedSupplier.supplierId) {
      return;
    }

    this.updateSupplier(this.selectedSupplier.supplierId, supplier);
    this.displayEditPopup = false;
  }

  onConfirmDelete(supplier: Supplier) {
    if (!supplier.supplierId) {
      return;
    }

    this.deleteSupplier(supplier.supplierId);
  }

  onConfirmAdd(supplier: Supplier) {
    this.addSupplier(supplier);
    this.displayAddPopup = false;
  }

  ngOnInit() {
    this.getAllSuppliers();
  }

  getAllSuppliers() {
    this.messageService.clear();

    this.apiService.get<Supplier[]>(`${this.url}/Supplier/allSuppliers`).subscribe({
      next: (suppliers: Supplier[]) => {
        this.suppliers = suppliers;
      },
      error: (error) => {
        const errorMessage = error.error || 'An unexpected error occurred.';
        this.messageService.add({ severity: 'error', summary: 'Failure Error', detail: errorMessage });
      }
    });
  }

  addSupplier(supplier: Supplier) {
    this.messageService.clear();

    this.apiService.post<Supplier>(`${this.url}/Supplier/addSupplier`, supplier).subscribe({
      next: (supplier: Supplier) => {
        this.getAllSuppliers();
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

  updateSupplier(id: number, supplier: Supplier) {
    this.messageService.clear();

    this.apiService.put<Supplier>(`${this.url}/Supplier/updateSupplier/${id}`, supplier).subscribe({
      next: (supplier: Supplier) => {
        this.getAllSuppliers();
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

  deleteSupplier(id: number) {
    this.messageService.clear();

    this.apiService.delete<Supplier>(`${this.url}/Supplier/deleteSupplier/${id}`).subscribe({
      next: (supplier: Supplier) => {
        this.getAllSuppliers();
      },
      error: (error) => {
        const errorMessage = error.error || 'An unexpected error occurred.';
        this.messageService.add({ severity: 'error', summary: 'Failure Error', detail: errorMessage });
      }
    });
  }

}
