import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../shared-components/material.module';

import { StoreRoutingModule } from './store-routing.module';
import { ManageStoreComponent } from './components/manage-store/manage-store.component';
import { StoreComponent } from './components/store/store.component';
import { WarehouseComponent } from './components/warehouse/warehouse.component';


@NgModule({
  declarations: [
    ManageStoreComponent,
    StoreComponent,
    WarehouseComponent
  ],
  imports: [
    CommonModule,
    StoreRoutingModule,
    MaterialModule
  ]
})
export class StoreModule { }
