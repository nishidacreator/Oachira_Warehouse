import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../../shared-components/material.module';

import { TripRoutingModule } from './trip-routing.module';
import { ManageTripComponent } from './components/manage-trip/manage-trip.component';


@NgModule({
  declarations: [
    ManageTripComponent
  ],
  imports: [
    CommonModule,
    TripRoutingModule,
    MaterialModule
  ]
})
export class TripModule { }
