import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchaseRoutingModule } from './purchase-routing.module';
import { RequestComponent } from './components/request/request.component';
import { OrderComponent } from './components/order/order.component';
import { EntryComponent } from './components/entry/entry.component';


@NgModule({
  declarations: [
    RequestComponent,
    OrderComponent,
    EntryComponent
  ],
  imports: [
    CommonModule,
    PurchaseRoutingModule
  ]
})
export class PurchaseModule { }
