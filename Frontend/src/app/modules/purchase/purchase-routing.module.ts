import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequestComponent } from './components/request/request.component';
import { OrderComponent } from './components/order/order.component';
import { EntryComponent } from './components/entry/entry.component';

const routes: Routes = [
  {path: 'purchaserequest', component: RequestComponent},
  {path: 'purchaseorder', component: OrderComponent},
  {path: 'purchaseentry', component: EntryComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseRoutingModule { }
