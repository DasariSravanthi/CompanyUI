import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataComponent } from './components/data/data.component';
import { ProductComponent } from './components/product/product.component';
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

const routes: Routes = [
  {
    path: '',
    component: DataComponent,
  },
  {
    path: 'product',
    component: ProductComponent,
  },
  {
    path: 'productDetail',
    component: ProductDetailComponent,
  },
  {
    path: 'supplier',
    component: SupplierComponent,
  },
  {
    path: 'size',
    component: SizeComponent,
  },
  {
    path: 'productStock',
    component: ProductStockComponent,
  },
  {
    path: 'receipt',
    component: ReceiptComponent,
  },
  {
    path: 'receiptDetail',
    component: ReceiptDetailComponent,
  },
  {
    path: 'rollNumber',
    component: RollNumberComponent,
  },
  {
    path: 'issue',
    component: IssueComponent,
  },
  {
    path: 'productionCoating',
    component: ProductionCoatingComponent,
  },
  {
    path: 'productionCalendaring',
    component: ProductionCalendaringComponent,
  },
  {
    path: 'productionSlitting',
    component: ProductionSlittingComponent,
  },
  {
    path: 'slittingDetail',
    component: SlittingDetailComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataRoutingModule { }
