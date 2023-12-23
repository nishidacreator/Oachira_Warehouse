import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../shared-components/material.module';

import { StoreRoutingModule } from './store-routing.module';
import { ManageStoreComponent } from './components/manage-store/manage-store.component';
import { StoreComponent } from './components/store/store.component';


@NgModule({
  declarations: [
    ManageStoreComponent,
    StoreComponent
  ],
  imports: [
    CommonModule,
    StoreRoutingModule,
    MaterialModule
  ]
})
export class StoreModule { }
