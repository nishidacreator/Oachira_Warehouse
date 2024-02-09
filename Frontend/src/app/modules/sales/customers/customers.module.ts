import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomersRoutingModule } from './customers-routing.module';
import { ManageCustomersComponent } from './components/manage-customers/manage-customers.component';
import { MaterialModule } from '../../shared-components/material.module';
import { CustomerCategoryComponent } from './components/customer-category/customer-category.component';
import { CustomerGradeComponent } from './components/customer-grade/customer-grade.component';
import { CustomerComponent } from './components/customer/customer.component';


@NgModule({
  declarations: [
    ManageCustomersComponent,
    CustomerCategoryComponent,
    CustomerGradeComponent,
    CustomerComponent
  ],
  imports: [
    CommonModule,
    CustomersRoutingModule,
    MaterialModule
  ]
})
export class CustomersModule { }
