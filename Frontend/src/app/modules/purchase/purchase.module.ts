import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../shared-components/material.module';

import { PurchaseRoutingModule } from './purchase-routing.module';
import { RequestComponent } from './components/request/request.component';
import { OrderComponent } from './components/order/order.component';
import { EntryComponent } from './components/entry/entry.component';
import { ViewOrderComponent } from './components/view-order/view-order.component';
import { ViewRequestComponent } from './components/view-request/view-request.component';
import { ViewPrComponent } from './components/view-pr/view-pr.component';
import { ListProductsComponent } from './components/list-products/list-products.component';
import { SlipComponent } from './components/slip/slip.component';
import { ViewEntryComponent } from './components/view-entry/view-entry.component';
import { ViewSlipComponent } from './components/view-slip/view-slip.component';
import { TransporterComponent } from './components/transporter/transporter.component';
import { PoInvoiceComponent } from './components/po-invoice/po-invoice.component';
import { RequestSlipComponent } from './components/request-slip/request-slip.component';
import { PurchaseTransporterComponent } from './components/purchase-transporter/purchase-transporter.component';
import { PrintPurchaseTransporterComponent } from './components/print-purchase-transporter/print-purchase-transporter.component';
import { PurchaseManagementComponent } from './components/purchase-management/purchase-management.component';
import { BrokerComponent } from './components/broker/broker.component';
import { BrokerageComponent } from './components/brokerage/brokerage.component';
import { PrintBrokerSlipComponent } from './components/print-broker-slip/print-broker-slip.component';
import { LoadingTeamComponent } from './components/loading-team/loading-team.component';
import { UnloadingSlipComponent } from './components/unloading-slip/unloading-slip.component';
import { PrintUnloadingSlipComponent } from './components/print-unloading-slip/print-unloading-slip.component';
import { PeInvoiceComponent } from './components/pe-invoice/pe-invoice.component';
import { EntryChequeComponent } from './components/entry-cheque/entry-cheque.component';
import { EditPeComponent } from './components/edit-pe/edit-pe.component';
import { AddPurchaseTransporterComponent } from './components/add-purchase-transporter/add-purchase-transporter.component';
import { AddBrokerageComponent } from './components/add-brokerage/add-brokerage.component';
import { AddUnloadingSlipComponent } from './components/add-unloading-slip/add-unloading-slip.component';



@NgModule({
  declarations: [
    RequestComponent,
    OrderComponent,
    EntryComponent,
    ViewOrderComponent,
    ViewRequestComponent,
    ViewPrComponent,
    ListProductsComponent,
    SlipComponent,
    ViewEntryComponent,
    ViewSlipComponent,
    TransporterComponent,
    PoInvoiceComponent,
    RequestSlipComponent,
    PurchaseTransporterComponent,
    PrintPurchaseTransporterComponent,
    PurchaseManagementComponent,
    BrokerComponent,
    BrokerageComponent,
    PrintBrokerSlipComponent,
    LoadingTeamComponent,
    UnloadingSlipComponent,
    PrintUnloadingSlipComponent,
    PeInvoiceComponent,
    EntryChequeComponent,
    EditPeComponent,
    AddPurchaseTransporterComponent,
    AddBrokerageComponent,
    AddUnloadingSlipComponent
  ],
  imports: [
    CommonModule,
    PurchaseRoutingModule,
    MaterialModule
  ]
})
export class PurchaseModule { }
