import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequestComponent } from './components/request/request.component';
import { OrderComponent } from './components/order/order.component';
import { EntryComponent } from './components/entry/entry.component';
import { ViewOrderComponent } from './components/view-order/view-order.component';
import { ViewRequestComponent } from './components/view-request/view-request.component';
import { ViewPrComponent } from './components/view-pr/view-pr.component';

const routes: Routes = [
  {path: 'purchaserequest', component: RequestComponent},
  {path: 'purchaserequest/:id', component: RequestComponent},
  {path: 'purchaseorder', component: OrderComponent},
  {path: 'purchaseentry', component: EntryComponent},
  {path: 'viewpurchaserequest', component: ViewRequestComponent},
  {path: 'viewpurchaseorder', component: ViewOrderComponent},
  {path: 'purchaserequest/view/:id', component: ViewPrComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseRoutingModule { }
