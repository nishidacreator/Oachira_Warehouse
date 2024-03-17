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
import { PurchaseTransporterComponent } from './components/purchase-transporter/purchase-transporter.component';
import { PrintPurchaseTransporterComponent } from './components/print-purchase-transporter/print-purchase-transporter.component';
import { PurchaseManagementComponent } from './components/purchase-management/purchase-management.component';
import { BrokerComponent } from './components/broker/broker.component';
import { PrintBrokerSlipComponent } from './components/print-broker-slip/print-broker-slip.component';
import { BrokerageComponent } from './components/brokerage/brokerage.component';
import { LoadingTeamComponent } from './components/loading-team/loading-team.component';
import { UnloadingSlipComponent } from './components/unloading-slip/unloading-slip.component';
import { PrintUnloadingSlipComponent } from './components/print-unloading-slip/print-unloading-slip.component';
import { EntryChequeComponent } from './components/entry-cheque/entry-cheque.component';
import { EditPeComponent } from './components/edit-pe/edit-pe.component';
import { AddPurchaseTransporterComponent } from './components/add-purchase-transporter/add-purchase-transporter.component';
import { AddBrokerageComponent } from './components/add-brokerage/add-brokerage.component';
import { AddUnloadingSlipComponent } from './components/add-unloading-slip/add-unloading-slip.component';


const routes: Routes = [
  {path: '', component: PurchaseManagementComponent},
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
  {path: 'viewtransportslip', component: PurchaseTransporterComponent},
  {path: 'printtransportslip/:id', component: PrintPurchaseTransporterComponent},
  {path: 'viewbrokerslip', component: BrokerageComponent},
  {path: 'printbrokerslip/:id', component: PrintBrokerSlipComponent},
  {path: 'transporter', component: TransporterComponent},
  {path: 'purchaseOrder/view/:id', component: PoInvoiceComponent},
  {path: 'broker', component: BrokerComponent},
  {path: 'loadingteam', component: LoadingTeamComponent},
  {path: 'viewunloadingslip', component: UnloadingSlipComponent},
  {path: 'printunloadingslip/:id', component: PrintUnloadingSlipComponent},
  {path: 'editpurchaseentry/:id', component: EditPeComponent},
  {path: 'entrycheque', component: EntryChequeComponent},
  {path: 'addtransporterslip/:id', component: AddPurchaseTransporterComponent},
  {path: 'addbrokerslip/:id', component: AddBrokerageComponent},
  {path: 'addunloadingslip/:id', component: AddUnloadingSlipComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseRoutingModule { }
