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
import { PurchaseTransporterComponent } from './components/purchase-transporter/purchase-transporter.component';
import { PrintPurchaseTransporterComponent } from './components/print-purchase-transporter/print-purchase-transporter.component';
import { PurchaseManagementComponent } from './components/purchase-management/purchase-management.component';
import { BrokerComponent } from './components/broker/broker.component';

const routes: Routes = [
  {path: '', component: PurchaseManagementComponent},
  {path: 'purchaserequest', component: RequestComponent},
  {path: 'purchaserequest/:id', component: RequestComponent},
  {path: 'purchaseorder', component: OrderComponent},
  {path: 'purchaseentry', component: EntryComponent},
  {path: 'viewpurchaserequest', component: ViewRequestComponent},
  {path: 'viewpurchaseorder', component: ViewOrderComponent},
  {path: 'viewpurchaseentry', component: ViewEntryComponent},
  {path: 'purchaserequest/view/:id', component: ViewPrComponent},
  {path: 'viewslip', component: ViewSlipComponent},
  {path: 'printslip/:id', component: SlipComponent},
  {path: 'viewtransportslip', component: PurchaseTransporterComponent},
  {path: 'printtransportslip/:id', component: PrintPurchaseTransporterComponent},
  {path: 'transporter', component: TransporterComponent},
  {path: 'broker', component: BrokerComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseRoutingModule { }
