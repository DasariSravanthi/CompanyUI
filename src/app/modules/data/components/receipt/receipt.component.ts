import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Receipt } from '../../../../../types';
import { environment } from '../../../../../environments/environment.development';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrl: './receipt.component.scss'
})
export class ReceiptComponent {
  constructor(private apiService: ApiService, private confirmationService: ConfirmationService, private messageService: MessageService) {}

  private url = environment.apiUrl;

  receipts: Receipt[] = [];

  displayEditPopup: boolean = false;
  displayAddPopup: boolean = false;
  
  selectedReceipt: Receipt = {
    receiptId: 0,
    receiptDate: '',
    supplierId: 0,
    supplierName: '',
    billNo: '',
    billDate: '',
    billValue: 0
  };

  toggleEditPopup(receipt: Receipt) {
    this.selectedReceipt = { ...receipt };
    this.displayEditPopup = true;
  }

  toggleDeleteDialog(receipt: Receipt) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this receipt?',
      accept: () => {
        this.onConfirmDelete(receipt);
      }
    });
  }

  toggleAddPopup() {
    this.displayAddPopup = true;
  }

  onConfirmEdit(receipt: Receipt) {
    if (!this.selectedReceipt.receiptId) {
      return;
    }

    this.updateReceipt(this.selectedReceipt.receiptId, receipt);
    this.displayEditPopup = false;
  }

  onConfirmDelete(receipt: Receipt) {
    if (!receipt.receiptId) {
      return;
    }

    this.deleteReceipt(receipt.receiptId);
  }

  onConfirmAdd(receipt: Receipt) {
    this.addReceipt(receipt);
    this.displayAddPopup = false;
  }

  ngOnInit() {
    this.getAllReceipts();
  }

  getAllReceipts() {
    this.messageService.clear();

    this.apiService.get<Receipt[]>(`${this.url}/Receipt/allReceipts`).subscribe({
      next: (receipts: Receipt[]) => {
        this.receipts = receipts;
      },
      error: (error) => {
        const errorMessage = error.error || 'An unexpected error occurred.';
        this.messageService.add({ severity: 'error', summary: 'Failure Error', detail: errorMessage });
      }
    });
  }

  addReceipt(receipt: Receipt) {
    this.messageService.clear();

    this.apiService.post<Receipt>(`${this.url}/Receipt/addReceipt`, receipt).subscribe({
      next: (receipt: Receipt) => {
        this.getAllReceipts();
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

  updateReceipt(id: number, receipt: Receipt) {
    this.messageService.clear();

    this.apiService.put<Receipt>(`${this.url}/Receipt/updateReceipt/${id}`, receipt).subscribe({
      next: (receipt: Receipt) => {
        this.getAllReceipts();
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

  deleteReceipt(id: number) {
    this.messageService.clear();

    this.apiService.delete<Receipt>(`${this.url}/Receipt/deleteReceipt/${id}`).subscribe({
      next: (receipt: Receipt) => {
        this.getAllReceipts();
      },
      error: (error) => {
        const errorMessage = error.error || 'An unexpected error occurred.';
        this.messageService.add({ severity: 'error', summary: 'Failure Error', detail: errorMessage });
      }
    });
  }
  
}
