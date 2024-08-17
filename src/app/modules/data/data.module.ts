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
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { SupplierComponent } from './components/supplier/supplier.component';
import { SizeComponent } from './components/size/size.component';
import { ProductStockComponent } from './components/product-stock/product-stock.component';
import { ReceiptComponent } from './components/receipt/receipt.component';
import { ReceiptDetailComponent } from './components/receipt-detail/receipt-detail.component';
import { RollNumberComponent } from './components/roll-number/roll-number.component';
import { IssueComponent } from './components/issue/issue.component';
import { ProductionCoatingComponent } from './components/production-coating/production-coating.component';
import { ProductionCalendaringComponent } from './components/production-calendaring/production-calendaring.component';
import { ProductionSlittingComponent } from './components/production-slitting/production-slitting.component';
import { SlittingDetailComponent } from './components/slitting-detail/slitting-detail.component';
import { LogoutComponent } from '../../logout/logout.component';

@NgModule({
  declarations: [
    ProductComponent,
    DataComponent,
    EditPopupComponent,
    ProductDetailComponent,
    SupplierComponent,
    SizeComponent,
    ProductStockComponent,
    ReceiptComponent,
    ReceiptDetailComponent,
    RollNumberComponent,
    IssueComponent,
    ProductionCoatingComponent,
    ProductionCalendaringComponent,
    ProductionSlittingComponent,
    SlittingDetailComponent
  ],
  imports: [
    CommonModule,
    DataRoutingModule,
    DialogModule,
    ConfirmDialogModule, 
    FormsModule,
    LogoutComponent
  ],
  providers: [ConfirmationService]
})
export class DataModule { }
