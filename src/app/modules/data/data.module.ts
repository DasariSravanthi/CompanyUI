import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataRoutingModule } from './data-routing.module';
import { ProductComponent } from './components/product/product.component';
import { DataComponent } from './components/data/data.component';
import { EditPopupComponent } from './components/edit-popup/edit-popup.component';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@NgModule({
  declarations: [
    ProductComponent,
    DataComponent,
    EditPopupComponent
  ],
  imports: [
    CommonModule,
    DataRoutingModule,
    DialogModule,
    ConfirmDialogModule, 
    FormsModule
  ],
  providers: [ConfirmationService]
})
export class DataModule { }
