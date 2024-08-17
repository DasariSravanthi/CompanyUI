import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ConfirmationService } from 'primeng/api';
import { ProductionCoating } from '../../../../../types';

@Component({
  selector: 'app-production-coating',
  templateUrl: './production-coating.component.html',
  styleUrl: './production-coating.component.scss'
})
export class ProductionCoatingComponent {
  constructor(private apiService: ApiService, private confirmationService: ConfirmationService) {}

  private url = 'http://localhost:5110/ProductionCoating';

  productionCoatings: ProductionCoating[] = [];

  displayEditPopup: boolean = false;
  displayAddPopup: boolean = false;
  
  selectedProductionCoating: ProductionCoating = {
    productionCoatingId: 0,
    productionCoatingDate: '',
    issueId: 0,
    coatingStart: '',
    coatingEnd: '',
    averageSpeed: 0,
    averageTemperature: 0,
    gsmCoated: 0,
    rollCount: 0
  };

  toggleEditPopup(productionCoating: ProductionCoating) {
    this.selectedProductionCoating = { ...productionCoating };
    this.displayEditPopup = true;
  }

  toggleDeleteDialog(productionCoating: ProductionCoating) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this productionCoating?',
      accept: () => {
        this.onConfirmDelete(productionCoating);
      }
    });
  }

  toggleAddPopup() {
    this.displayAddPopup = true;
  }

  onConfirmEdit(productionCoating: ProductionCoating) {
    if (!this.selectedProductionCoating.productionCoatingId) {
      return;
    }

    this.updateProductionCoating(this.selectedProductionCoating.productionCoatingId, productionCoating);
    this.displayEditPopup = false;
  }

  onConfirmDelete(productionCoating: ProductionCoating) {
    if (!productionCoating.productionCoatingId) {
      return;
    }

    this.deleteProductionCoating(productionCoating.productionCoatingId);
  }

  onConfirmAdd(productionCoating: ProductionCoating) {
    this.addProductionCoating(productionCoating);
    this.displayAddPopup = false;
  }

  ngOnInit() {
    this.getAllProductionCoatings();
  }

  getAllProductionCoatings() {
    this.apiService.get<ProductionCoating[]>(`${this.url}/allProductionCoatings`).subscribe({
      next: (productionCoatings: ProductionCoating[]) => {
        this.productionCoatings = productionCoatings;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  addProductionCoating(productionCoating: ProductionCoating) {
    this.apiService.post<ProductionCoating>(`${this.url}/addProductionCoating`, productionCoating).subscribe({
      next: (productionCoating: ProductionCoating) => {
        this.getAllProductionCoatings();
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  updateProductionCoating(id: number, productionCoating: ProductionCoating) {
    this.apiService.put<ProductionCoating>(`${this.url}/updateProductionCoating/${id}`, productionCoating).subscribe({
      next: (productionCoating: ProductionCoating) => {
        this.getAllProductionCoatings();
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  deleteProductionCoating(id: number) {
    this.apiService.delete<ProductionCoating>(`${this.url}/deleteProductionCoating/${id}`).subscribe({
      next: (productionCoating: ProductionCoating) => {
        this.getAllProductionCoatings();
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

}
