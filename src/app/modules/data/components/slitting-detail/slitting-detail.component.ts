import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SlittingDetail } from '../../../../../types';

@Component({
  selector: 'app-slitting-detail',
  templateUrl: './slitting-detail.component.html',
  styleUrl: './slitting-detail.component.scss'
})
export class SlittingDetailComponent {
  constructor(private apiService: ApiService, private confirmationService: ConfirmationService, private messageService: MessageService) {}

  private url = 'http://localhost:5110/SlittingDetail';

  slittingDetails: SlittingDetail[] = [];

  displayEditPopup: boolean = false;
  displayAddPopup: boolean = false;
  
  selectedSlittingDetail: SlittingDetail = {
    slittingDetailId: 0,
    productionSlittingId: 0,
    rollNumber: '',
    weight: 0,
    moisture: 0
  };

  toggleEditPopup(slittingDetail: SlittingDetail) {
    this.selectedSlittingDetail = { ...slittingDetail };
    this.displayEditPopup = true;
  }

  toggleDeleteDialog(slittingDetail: SlittingDetail) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this slittingDetail?',
      accept: () => {
        this.onConfirmDelete(slittingDetail);
      }
    });
  }

  toggleAddPopup() {
    this.displayAddPopup = true;
  }

  onConfirmEdit(slittingDetail: SlittingDetail) {
    if (!this.selectedSlittingDetail.slittingDetailId) {
      return;
    }

    this.updateSlittingDetail(this.selectedSlittingDetail.slittingDetailId, slittingDetail);
    this.displayEditPopup = false;
  }

  onConfirmDelete(slittingDetail: SlittingDetail) {
    if (!slittingDetail.slittingDetailId) {
      return;
    }

    this.deleteSlittingDetail(slittingDetail.slittingDetailId);
  }

  onConfirmAdd(slittingDetail: SlittingDetail) {
    this.addSlittingDetail(slittingDetail);
    this.displayAddPopup = false;
  }

  ngOnInit() {
    this.getAllSlittingDetails();
  }

  getAllSlittingDetails() {
    this.messageService.clear();

    this.apiService.get<SlittingDetail[]>(`${this.url}/allSlittingDetails`).subscribe({
      next: (slittingDetails: SlittingDetail[]) => {
        this.slittingDetails = slittingDetails;
      },
      error: (error) => {
        const errorMessage = error.error || 'An unexpected error occurred.';
        this.messageService.add({ severity: 'error', summary: 'Failure Error', detail: errorMessage });
      }
    });
  }

  addSlittingDetail(slittingDetail: SlittingDetail) {
    this.messageService.clear();

    this.apiService.post<SlittingDetail>(`${this.url}/addSlittingDetail`, slittingDetail).subscribe({
      next: (slittingDetail: SlittingDetail) => {
        this.getAllSlittingDetails();
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

  updateSlittingDetail(id: number, slittingDetail: SlittingDetail) {
    this.messageService.clear();

    this.apiService.put<SlittingDetail>(`${this.url}/updateSlittingDetail/${id}`, slittingDetail).subscribe({
      next: (slittingDetail: SlittingDetail) => {
        this.getAllSlittingDetails();
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

  deleteSlittingDetail(id: number) {
    this.messageService.clear();

    this.apiService.delete<SlittingDetail>(`${this.url}/deleteSlittingDetail/${id}`).subscribe({
      next: (slittingDetail: SlittingDetail) => {
        this.getAllSlittingDetails();
      },
      error: (error) => {
        const errorMessage = error.error || 'An unexpected error occurred.';
        this.messageService.add({ severity: 'error', summary: 'Failure Error', detail: errorMessage });
      }
    });
  }

}
