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
import { ViewTripComponent } from './components/view-trip/view-trip.component';
import { ViewTripDetailsComponent } from './components/view-trip-details/view-trip-details.component';
import { RouteMapComponent } from './components/route-map/route-map.component';
import { TripListComponent } from './components/trip-list/trip-list.component';
import { RouteOrderComponent } from './components/route-order/route-order.component';
import { ViewRouteOrderComponent } from './components/view-route-order/view-route-order.component';
import { ViewRouteOrderDetailsComponent } from './components/view-route-order-details/view-route-order-details.component';
import { RouteEntryComponent } from './components/route-entry/route-entry.component';
import { ViewRouteEntryComponent } from './components/view-route-entry/view-route-entry.component';
import { ViewRouteEntryDetailsComponent } from './components/view-route-entry-details/view-route-entry-details.component';
import { DailyCollectionComponent } from './components/daily-collection/daily-collection.component';
import { ViewDailyCollectionComponent } from './components/view-daily-collection/view-daily-collection.component';
import { DetailsViewDailycollectionComponent } from './components/details-view-dailycollection/details-view-dailycollection.component';


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
    ViewPickListDetailsComponent,
    ViewTripComponent,
    ViewTripDetailsComponent,
    RouteMapComponent,
    TripListComponent,
    RouteOrderComponent,
    ViewRouteOrderComponent,
    ViewRouteOrderDetailsComponent,
    RouteEntryComponent,
    ViewRouteEntryComponent,
    ViewRouteEntryDetailsComponent,
    DailyCollectionComponent,
    ViewDailyCollectionComponent,
    DetailsViewDailycollectionComponent
  ],
  imports: [
    CommonModule,
    RouteRoutingModule,
    MaterialModule
  ]
})
export class RouteModule { }
