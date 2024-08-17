import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ConfirmationService } from 'primeng/api';
import { Supplier } from '../../../../../types';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrl: './supplier.component.scss'
})
export class SupplierComponent {
  constructor(private apiService: ApiService, private confirmationService: ConfirmationService) {}

  private url = 'http://localhost:5110/Supplier';

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
    this.apiService.get<Supplier[]>(`${this.url}/allSuppliers`).subscribe({
      next: (suppliers: Supplier[]) => {
        this.suppliers = suppliers;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  addSupplier(supplier: Supplier) {
    this.apiService.post<Supplier>(`${this.url}/addSupplier`, supplier).subscribe({
      next: (supplier: Supplier) => {
        this.getAllSuppliers();
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  updateSupplier(id: number, supplier: Supplier) {
    this.apiService.put<Supplier>(`${this.url}/updateSupplier/${id}`, supplier).subscribe({
      next: (supplier: Supplier) => {
        this.getAllSuppliers();
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  deleteSupplier(id: number) {
    this.apiService.delete<Supplier>(`${this.url}/deleteSupplier/${id}`).subscribe({
      next: (supplier: Supplier) => {
        this.getAllSuppliers();
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

}
