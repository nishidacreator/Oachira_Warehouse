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
    PoInvoiceComponent
  ],
  imports: [
    CommonModule,
    PurchaseRoutingModule,
    MaterialModule
  ]
})
export class PurchaseModule { }
