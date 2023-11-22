import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../shared-components/material.module';

import { ProductsRoutingModule } from './products-routing.module';
import { AddComponent } from './components/add/add.component';
import { ManageComponent } from './components/manage/manage.component';


@NgModule({
  declarations: [
    AddComponent,
    ManageComponent
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    MaterialModule
  ]
})
export class ProductsModule { }
