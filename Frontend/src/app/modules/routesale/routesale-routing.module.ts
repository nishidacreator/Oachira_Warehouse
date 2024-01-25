import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageSaleComponent } from './components/manage-sale/manage-sale.component';

const routes: Routes = [
  {path: '', component:ManageSaleComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoutesaleRoutingModule { }
