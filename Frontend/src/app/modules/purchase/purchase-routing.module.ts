import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequestComponent } from './components/request/request.component';
import { OrderComponent } from './components/order/order.component';
import { EntryComponent } from './components/entry/entry.component';
import { ViewOrderComponent } from './components/view-order/view-order.component';
import { ViewRequestComponent } from './components/view-request/view-request.component';
import { ViewPrComponent } from './components/view-pr/view-pr.component';
import { ViewEntryComponent } from './components/view-entry/view-entry.component';
import { ViewSlipComponent } from './components/view-slip/view-slip.component';
import { SlipComponent } from './components/slip/slip.component';
import { TransporterComponent } from './components/transporter/transporter.component';
import { PoInvoiceComponent } from './components/po-invoice/po-invoice.component';
import { RequestSlipComponent } from './components/request-slip/request-slip.component';

const routes: Routes = [
  {path: 'purchaserequest', component: RequestComponent},
  {path: 'purchaserequest/:id', component: RequestComponent},
  {path: 'purchaseorder', component: OrderComponent},
  {path: 'purchaseorder/:id', component: OrderComponent},
  {path: 'purchaseentry', component: EntryComponent},
  {path: 'viewpurchaserequest', component: ViewRequestComponent},
  {path: 'viewpurchaseorder', component: ViewOrderComponent},
  {path: 'viewpurchaseentry', component: ViewEntryComponent},
  {path: 'purchaserequest/view/:id', component: RequestSlipComponent},
  {path: 'viewslip', component: ViewSlipComponent},
  {path: 'printslip/:id', component: SlipComponent},
  {path: 'transporter', component: TransporterComponent},
  {path: 'purchaseOrder/view/:id', component: PoInvoiceComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseRoutingModule { }
