import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { RollNumber } from '../../../../../types';
import { environment } from '../../../../../environments/environment.development';

@Component({
  selector: 'app-roll-number',
  templateUrl: './roll-number.component.html',
  styleUrl: './roll-number.component.scss'
})
export class RollNumberComponent {
  constructor(private apiService: ApiService, private confirmationService: ConfirmationService, private messageService: MessageService) {}

  private url = environment.apiUrl;

  rollNumbers: RollNumber[] = [];

  displayEditPopup: boolean = false;
  displayAddPopup: boolean = false;
  
  selectedRollNumber: RollNumber = {
    rollNumberId: 0,
    receiptDetailId: 0,
    rollNumberValue: ''
  };

  toggleEditPopup(rollNumber: RollNumber) {
    this.selectedRollNumber = { ...rollNumber };
    this.displayEditPopup = true;
  }

  toggleDeleteDialog(rollNumber: RollNumber) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this rollNumber?',
      accept: () => {
        this.onConfirmDelete(rollNumber);
      }
    });
  }

  toggleAddPopup() {
    this.displayAddPopup = true;
  }

  onConfirmEdit(rollNumber: RollNumber) {
    if (!this.selectedRollNumber.rollNumberId) {
      return;
    }

    this.updateRollNumber(this.selectedRollNumber.rollNumberId, rollNumber);
    this.displayEditPopup = false;
  }

  onConfirmDelete(rollNumber: RollNumber) {
    if (!rollNumber.rollNumberId) {
      return;
    }

    this.deleteRollNumber(rollNumber.rollNumberId);
  }

  onConfirmAdd(rollNumber: RollNumber) {
    this.addRollNumber(rollNumber);
    this.displayAddPopup = false;
  }

  ngOnInit() {
    this.getAllRollNumbers();
  }

  getAllRollNumbers() {
    this.messageService.clear();

    this.apiService.get<RollNumber[]>(`${this.url}/RollNumber/allRollNumbers`).subscribe({
      next: (rollNumbers: RollNumber[]) => {
        this.rollNumbers = rollNumbers;
      },
      error: (error) => {
        const errorMessage = error.error || 'An unexpected error occurred.';
        this.messageService.add({ severity: 'error', summary: 'Failure Error', detail: errorMessage });
      }
    });
  }

  addRollNumber(rollNumber: RollNumber) {
    this.messageService.clear();

    this.apiService.post<RollNumber>(`${this.url}/RollNumber/addRollNumber`, rollNumber).subscribe({
      next: (rollNumber: RollNumber) => {
        this.getAllRollNumbers();
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

  updateRollNumber(id: number, rollNumber: RollNumber) {
    this.messageService.clear();

    this.apiService.put<RollNumber>(`${this.url}/RollNumber/updateRollNumber/${id}`, rollNumber).subscribe({
      next: (rollNumber: RollNumber) => {
        this.getAllRollNumbers();
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

  deleteRollNumber(id: number) {
    this.messageService.clear();

    this.apiService.delete<RollNumber>(`${this.url}/RollNumber/deleteRollNumber/${id}`).subscribe({
      next: (rollNumber: RollNumber) => {
        this.getAllRollNumbers();
      },
      error: (error) => {
        const errorMessage = error.error || 'An unexpected error occurred.';
        this.messageService.add({ severity: 'error', summary: 'Failure Error', detail: errorMessage });
      }
    });
  }

}
