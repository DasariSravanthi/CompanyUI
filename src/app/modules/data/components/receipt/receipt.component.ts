import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Receipt, ReceiptDetail } from '../../../../../types';
import { environment } from '../../../../../environments/environment.development';
import { firstValueFrom } from 'rxjs';

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

  receiptId: number | 0 = 0;
  selectedReceiptDetails: ReceiptDetail[] = [];

  showDialog = false;
  selectedReceiptToView: any = null;
  
  selectedReceipt: Receipt = {
    receiptId: 0,
    receiptDate: '',
    supplierId: 0,
    supplierName: '',
    billNo: '',
    billDate: '',
    billValue: 0,
    receiptDetails: []
  };

  fromDate!: Date;
  toDate!: Date;
  filteredReceipts: Receipt[] = [];

  toggleEditPopup(receipt: Receipt) {
    this.selectedReceipt = { ...receipt };
    this.selectedReceiptDetails = [ ...receipt.receiptDetails ];
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

  async onConfirmEdit(receipt: Receipt) {
    if (!this.selectedReceipt.receiptId) {
      return;
    }

    await this.updateReceipt(this.selectedReceipt.receiptId, receipt);
    if (this.receiptId) {
      receipt.receiptDetails = receipt.receiptDetails.map(detail => ({
        ...detail, 
        receiptId: this.receiptId
      }));
      this.selectedReceiptDetails = this.selectedReceiptDetails.filter(detail =>
        receipt.receiptDetails.every(receiptDetail => receiptDetail.receiptDetailId !== detail.receiptDetailId)
      );
      this.selectedReceiptDetails.forEach(detail => {
        if (detail.receiptDetailId) {
          this.deleteReceiptDetail(detail.receiptDetailId);
        }
      });
      receipt.receiptDetails.forEach(detail => {
        if (detail.receiptDetailId) {
          this.updateReceiptDetail(detail.receiptDetailId, detail);
        }
        else {
          this.addReceiptDetail(detail);
        }
      });
    }
    this.receiptId = 0;
    this.displayEditPopup = false;
  }

  async onConfirmDelete(receipt: Receipt) {
    if (!receipt.receiptId) {
      return;
    }

    await this.deleteReceipt(receipt.receiptId);
    if (this.receiptId) {
      receipt.receiptDetails = receipt.receiptDetails.map(detail => ({
        ...detail, 
        receiptId: this.receiptId
      }));
      receipt.receiptDetails.forEach(detail => {
        if (detail.receiptDetailId) {
          this.deleteReceiptDetail(detail.receiptDetailId);
        }
      });
    }
    this.receiptId = 0;
  }

  async onConfirmAdd(receipt: Receipt) {
    await this.addReceipt(receipt);
    if (this.receiptId) {
      receipt.receiptDetails = receipt.receiptDetails.map(detail => ({
        ...detail, 
        receiptId: this.receiptId
      }));
      receipt.receiptDetails.forEach(detail => {
        this.addReceiptDetail(detail);
      });
    }
    this.receiptId = 0;
    this.displayAddPopup = false;
  }

  viewDetails(receipt: any) {
    this.selectedReceiptToView = receipt; // Store the selected receipt
    this.showDialog = true; // Open the dialog
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

  async addReceipt(receipt: Receipt) {
    this.messageService.clear();

    try {
      const newReceipt = await firstValueFrom(this.apiService.post<Receipt>(`${this.url}/Receipt/addReceipt`, receipt));
      
      this.receiptId = newReceipt.receiptId ?? 0;
      this.getAllReceipts();
    } catch (error: any) {
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
  }

  async updateReceipt(id: number, receipt: Receipt) {
    this.messageService.clear();

    try {
      const updatedReceipt = await firstValueFrom(this.apiService.put<Receipt>(`${this.url}/Receipt/updateReceipt/${id}`, receipt));

      this.receiptId = updatedReceipt.receiptId ?? 0;
      this.getAllReceipts();
    } catch (error: any) {
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
  }

  async deleteReceipt(id: number) {
    this.messageService.clear();

    try {
      await firstValueFrom(this.apiService.delete<Receipt>(`${this.url}/Receipt/deleteReceipt/${id}`));
      this.getAllReceipts();
    } catch (error: any) {
      const errorMessage = error.error || 'An unexpected error occurred.';
      this.messageService.add({ severity: 'error', summary: 'Failure Error', detail: errorMessage });
    }
  }

  addReceiptDetail(receiptDetail: ReceiptDetail) {
    this.messageService.clear();

    this.apiService.post<ReceiptDetail>(`${this.url}/ReceiptDetail/addReceiptDetail`, receiptDetail).subscribe({
      next: (receiptDetail: ReceiptDetail) => {
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

  updateReceiptDetail(id: number, receiptDetail: ReceiptDetail) {
    this.messageService.clear();

    this.apiService.put<ReceiptDetail>(`${this.url}/ReceiptDetail/updateReceiptDetail/${id}`, receiptDetail).subscribe({
      next: (receiptDetail: ReceiptDetail) => {
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

  deleteReceiptDetail(id: number) {
    this.messageService.clear();

    this.apiService.delete<ReceiptDetail>(`${this.url}/ReceiptDetail/deleteReceiptDetail/${id}`).subscribe({
      next: (receiptDetail: ReceiptDetail) => {
        this.getAllReceipts();
      },
      error: (error) => {
        const errorMessage = error.error || 'An unexpected error occurred.';
        this.messageService.add({ severity: 'error', summary: 'Failure Error', detail: errorMessage });
      }
    });
  }

  onDateSelect() {
    this.filteredReceipts = this.receipts.filter(receipt => receipt.receiptDate > this.fromDate.toLocaleDateString('en-CA', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    }) && receipt.receiptDate <= this.toDate.toLocaleDateString('en-CA', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    }));

    // console.log(filteredReceipts);
  }
  
}
