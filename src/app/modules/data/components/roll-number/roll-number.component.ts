import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ConfirmationService } from 'primeng/api';
import { RollNumber } from '../../../../../types';

@Component({
  selector: 'app-roll-number',
  templateUrl: './roll-number.component.html',
  styleUrl: './roll-number.component.scss'
})
export class RollNumberComponent {
  constructor(private apiService: ApiService, private confirmationService: ConfirmationService) {}

  private url = 'http://localhost:5110/RollNumber';

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
    this.apiService.get<RollNumber[]>(`${this.url}/allRollNumbers`).subscribe({
      next: (rollNumbers: RollNumber[]) => {
        this.rollNumbers = rollNumbers;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  addRollNumber(rollNumber: RollNumber) {
    this.apiService.post<RollNumber>(`${this.url}/addRollNumber`, rollNumber).subscribe({
      next: (rollNumber: RollNumber) => {
        this.getAllRollNumbers();
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  updateRollNumber(id: number, rollNumber: RollNumber) {
    this.apiService.put<RollNumber>(`${this.url}/updateRollNumber/${id}`, rollNumber).subscribe({
      next: (rollNumber: RollNumber) => {
        this.getAllRollNumbers();
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  deleteRollNumber(id: number) {
    this.apiService.delete<RollNumber>(`${this.url}/deleteRollNumber/${id}`).subscribe({
      next: (rollNumber: RollNumber) => {
        this.getAllRollNumbers();
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

}
