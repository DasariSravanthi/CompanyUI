import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataComponent } from './components/data/data.component';
import { ProductComponent } from './components/product/product.component';

const routes: Routes = [
  {
    path: '',
    component: DataComponent,
  },
  {
    path: 'product',
    component: ProductComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataRoutingModule { }
