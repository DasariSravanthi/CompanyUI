import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Issue } from '../../../../../types';

@Component({
  selector: 'app-issue',
  templateUrl: './issue.component.html',
  styleUrl: './issue.component.scss'
})
export class IssueComponent {
  constructor(private apiService: ApiService, private confirmationService: ConfirmationService, private messageService: MessageService) {}

  private url = 'http://localhost:5110/Issue';

  issues: Issue[] = [];

  displayEditPopup: boolean = false;
  displayAddPopup: boolean = false;
  
  selectedIssue: Issue = {
    issueId: 0,
    issueDate: '',
    rollNumberId: 0,
    productStockId: 0,
    rollNumber: '',
    weight: 0,
    moisture: 0
  };

  toggleEditPopup(issue: Issue) {
    this.selectedIssue = { ...issue };
    this.displayEditPopup = true;
  }

  toggleDeleteDialog(issue: Issue) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this issue?',
      accept: () => {
        this.onConfirmDelete(issue);
      }
    });
  }

  toggleAddPopup() {
    this.displayAddPopup = true;
  }

  onConfirmEdit(issue: Issue) {
    if (!this.selectedIssue.issueId) {
      return;
    }

    this.updateIssue(this.selectedIssue.issueId, issue);
    this.displayEditPopup = false;
  }

  onConfirmDelete(issue: Issue) {
    if (!issue.issueId) {
      return;
    }

    this.deleteIssue(issue.issueId);
  }

  onConfirmAdd(issue: Issue) {
    this.addIssue(issue);
    this.displayAddPopup = false;
  }

  ngOnInit() {
    this.getAllIssues();
  }

  getAllIssues() {
    this.messageService.clear();

    this.apiService.get<Issue[]>(`${this.url}/allIssues`).subscribe({
      next: (issues: Issue[]) => {
        this.issues = issues;
      },
      error: (error) => {
        const errorMessage = error.error || 'An unexpected error occurred.';
        this.messageService.add({ severity: 'error', summary: 'Failure Error', detail: errorMessage });
      }
    });
  }

  addIssue(issue: Issue) {
    this.messageService.clear();

    this.apiService.post<Issue>(`${this.url}/addIssue`, issue).subscribe({
      next: (issue: Issue) => {
        this.getAllIssues();
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

  updateIssue(id: number, issue: Issue) {
    this.messageService.clear();

    this.apiService.put<Issue>(`${this.url}/updateIssue/${id}`, issue).subscribe({
      next: (issue: Issue) => {
        this.getAllIssues();
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

  deleteIssue(id: number) {
    this.messageService.clear();

    this.apiService.delete<Issue>(`${this.url}/deleteIssue/${id}`).subscribe({
      next: (issue: Issue) => {
        this.getAllIssues();
      },
      error: (error) => {
        const errorMessage = error.error || 'An unexpected error occurred.';
        this.messageService.add({ severity: 'error', summary: 'Failure Error', detail: errorMessage });
      }
    });
  }

}
