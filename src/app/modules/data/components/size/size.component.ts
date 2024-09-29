import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Size } from '../../../../../types';

@Component({
  selector: 'app-size',
  templateUrl: './size.component.html',
  styleUrl: './size.component.scss'
})
export class SizeComponent {
  constructor(private apiService: ApiService, private confirmationService: ConfirmationService, private messageService: MessageService) {}

  private url = 'http://localhost:5110/Size';

  sizes: Size[] = [];

  displayEditPopup: boolean = false;
  displayAddPopup: boolean = false;
  
  selectedSize: Size = {
    sizeId: 0,
    sizeInMM: 0
  };

  toggleEditPopup(size: Size) {
    this.selectedSize = { ...size };
    this.displayEditPopup = true;
  }

  toggleDeleteDialog(size: Size) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this size?',
      accept: () => {
        this.onConfirmDelete(size);
      }
    });
  }

  toggleAddPopup() {
    this.displayAddPopup = true;
  }

  onConfirmEdit(size: Size) {
    if (!this.selectedSize.sizeId) {
      return;
    }

    this.updateSize(this.selectedSize.sizeId, size);
    this.displayEditPopup = false;
  }

  onConfirmDelete(size: Size) {
    if (!size.sizeId) {
      return;
    }

    this.deleteSize(size.sizeId);
  }

  onConfirmAdd(size: Size) {
    this.addSize(size);
    this.displayAddPopup = false;
  }

  ngOnInit() {
    this.getAllSizes();
  }

  getAllSizes() {
    this.messageService.clear();

    this.apiService.get<Size[]>(`${this.url}/allSizes`).subscribe({
      next: (sizes: Size[]) => {
        this.sizes = sizes;
      },
      error: (error) => {
        const errorMessage = error.error || 'An unexpected error occurred.';
        this.messageService.add({ severity: 'error', summary: 'Failure Error', detail: errorMessage });
      }
    });
  }

  addSize(size: Size) {
    this.messageService.clear();

    this.apiService.post<Size>(`${this.url}/addSize`, size).subscribe({
      next: (size: Size) => {
        this.getAllSizes();
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

  updateSize(id: number, size: Size) {
    this.messageService.clear();

    this.apiService.put<Size>(`${this.url}/updateSize/${id}`, size).subscribe({
      next: (size: Size) => {
        this.getAllSizes();
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

  deleteSize(id: number) {
    this.messageService.clear();

    this.apiService.delete<Size>(`${this.url}/deleteSize/${id}`).subscribe({
      next: (size: Size) => {
        this.getAllSizes();
      },
      error: (error) => {
        const errorMessage = error.error || 'An unexpected error occurred.';
        this.messageService.add({ severity: 'error', summary: 'Failure Error', detail: errorMessage });
      }
    });
  }

}
