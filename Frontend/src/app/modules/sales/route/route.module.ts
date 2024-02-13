import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../../shared-components/material.module';

import { RouteRoutingModule } from './route-routing.module';
import { ManageRouteComponent } from './components/manage-route/manage-route.component';
import { RouteComponent } from './components/route/route.component';
import { RouteDaysComponent } from './components/route-days/route-days.component';
import { RouteDetailsComponent } from './components/route-details/route-details.component';
import { VehicleTypeComponent } from './components/vehicle-type/vehicle-type.component';
import { VehicleComponent } from './components/vehicle/vehicle.component';
import { TripDaysComponent } from './components/trip-days/trip-days.component';
import { TripComponent } from './components/trip/trip.component';
import { PickListComponent } from './components/pick-list/pick-list.component';
import { ViewPickListComponent } from './components/view-pick-list/view-pick-list.component';
import { ViewPickListDetailsComponent } from './components/view-pick-list-details/view-pick-list-details.component';


@NgModule({
  declarations: [
    ManageRouteComponent,
    RouteComponent,
    RouteDaysComponent,
    RouteDetailsComponent,
    VehicleTypeComponent,
    VehicleComponent,
    TripDaysComponent,
    TripComponent,
    PickListComponent,
    ViewPickListComponent,
    ViewPickListDetailsComponent
  ],
  imports: [
    CommonModule,
    RouteRoutingModule,
    MaterialModule
  ]
})
export class RouteModule { }
