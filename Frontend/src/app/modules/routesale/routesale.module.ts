import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../shared-components/material.module';

import { RoutesaleRoutingModule } from './routesale-routing.module';
import { CustomerComponent } from './components/customer/customer.component';
import { ManageSaleComponent } from './components/manage-sale/manage-sale.component';


@NgModule({
  declarations: [
    CustomerComponent,
    ManageSaleComponent
  ],
  imports: [
    CommonModule,
    RoutesaleRoutingModule,
    MaterialModule
  ]
})
export class RoutesaleModule { }
