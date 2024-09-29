import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ReceiptDetail } from '../../../../../types';

@Component({
  selector: 'app-receipt-detail',
  templateUrl: './receipt-detail.component.html',
  styleUrl: './receipt-detail.component.scss'
})
export class ReceiptDetailComponent {
  constructor(private apiService: ApiService, private confirmationService: ConfirmationService, private messageService: MessageService) {}

  private url = 'http://localhost:5110/ReceiptDetail';

  receiptDetails: ReceiptDetail[] = [];

  displayEditPopup: boolean = false;
  displayAddPopup: boolean = false;
  
  selectedReceiptDetail: ReceiptDetail = {
    receiptDetailId: 0,
    receiptId: 0,
    productStockId: 0,
    weight: 0,
    unitRate: 0,
    rollCount: 0
  };

  toggleEditPopup(receiptDetail: ReceiptDetail) {
    this.selectedReceiptDetail = { ...receiptDetail };
    this.displayEditPopup = true;
  }

  toggleDeleteDialog(receiptDetail: ReceiptDetail) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this receiptDetail?',
      accept: () => {
        this.onConfirmDelete(receiptDetail);
      }
    });
  }

  toggleAddPopup() {
    this.displayAddPopup = true;
  }

  onConfirmEdit(receiptDetail: ReceiptDetail) {
    if (!this.selectedReceiptDetail.receiptDetailId) {
      return;
    }

    this.updateReceiptDetail(this.selectedReceiptDetail.receiptDetailId, receiptDetail);
    this.displayEditPopup = false;
  }

  onConfirmDelete(receiptDetail: ReceiptDetail) {
    if (!receiptDetail.receiptDetailId) {
      return;
    }

    this.deleteReceiptDetail(receiptDetail.receiptDetailId);
  }

  onConfirmAdd(receiptDetail: ReceiptDetail) {
    this.addReceiptDetail(receiptDetail);
    this.displayAddPopup = false;
  }

  ngOnInit() {
    this.getAllReceiptDetails();
  }

  getAllReceiptDetails() {
    this.messageService.clear();

    this.apiService.get<ReceiptDetail[]>(`${this.url}/allReceiptDetails`).subscribe({
      next: (receiptDetails: ReceiptDetail[]) => {
        this.receiptDetails = receiptDetails;
      },
      error: (error) => {
        const errorMessage = error.error || 'An unexpected error occurred.';
        this.messageService.add({ severity: 'error', summary: 'Failure Error', detail: errorMessage });
      }
    });
  }

  addReceiptDetail(receiptDetail: ReceiptDetail) {
    this.messageService.clear();

    this.apiService.post<ReceiptDetail>(`${this.url}/addReceiptDetail`, receiptDetail).subscribe({
      next: (receiptDetail: ReceiptDetail) => {
        this.getAllReceiptDetails();
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

  updateReceiptDetail(id: number, receiptDetail: ReceiptDetail) {
    this.messageService.clear();

    this.apiService.put<ReceiptDetail>(`${this.url}/updateReceiptDetail/${id}`, receiptDetail).subscribe({
      next: (receiptDetail: ReceiptDetail) => {
        this.getAllReceiptDetails();
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

  deleteReceiptDetail(id: number) {
    this.messageService.clear();

    this.apiService.delete<ReceiptDetail>(`${this.url}/deleteReceiptDetail/${id}`).subscribe({
      next: (receiptDetail: ReceiptDetail) => {
        this.getAllReceiptDetails();
      },
      error: (error) => {
        const errorMessage = error.error || 'An unexpected error occurred.';
        this.messageService.add({ severity: 'error', summary: 'Failure Error', detail: errorMessage });
      }
    });
  }
  
}
