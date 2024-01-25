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


@NgModule({
  declarations: [
    RequestComponent,
    OrderComponent,
    EntryComponent,
    ViewOrderComponent,
    ViewRequestComponent,
    ViewPrComponent,
    ListProductsComponent
  ],
  imports: [
    CommonModule,
    PurchaseRoutingModule,
    MaterialModule
  ]
})
export class PurchaseModule { }
