import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ConfirmationService } from 'primeng/api';
import { Receipt } from '../../../../../types';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrl: './receipt.component.scss'
})
export class ReceiptComponent {
  constructor(private apiService: ApiService, private confirmationService: ConfirmationService) {}

  private url = 'http://localhost:5110/Receipt';

  receipts: Receipt[] = [];

  displayEditPopup: boolean = false;
  displayAddPopup: boolean = false;
  
  selectedReceipt: Receipt = {
    receiptId: 0,
    receiptDate: '',
    supplierId: 0,
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
    this.apiService.get<Receipt[]>(`${this.url}/allReceipts`).subscribe({
      next: (receipts: Receipt[]) => {
        this.receipts = receipts;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  addReceipt(receipt: Receipt) {
    this.apiService.post<Receipt>(`${this.url}/addReceipt`, receipt).subscribe({
      next: (receipt: Receipt) => {
        this.getAllReceipts();
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  updateReceipt(id: number, receipt: Receipt) {
    this.apiService.put<Receipt>(`${this.url}/updateReceipt/${id}`, receipt).subscribe({
      next: (receipt: Receipt) => {
        this.getAllReceipts();
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  deleteReceipt(id: number) {
    this.apiService.delete<Receipt>(`${this.url}/deleteReceipt/${id}`).subscribe({
      next: (receipt: Receipt) => {
        this.getAllReceipts();
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
  
}
