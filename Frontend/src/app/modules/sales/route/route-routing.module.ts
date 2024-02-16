import { NgModule } from '@angular/core';
import { RouteConfigLoadStart, RouterModule, Routes } from '@angular/router';
import { ManageRouteComponent } from './components/manage-route/manage-route.component';
import { RouteComponent } from './components/route/route.component';
import { RouteDaysComponent } from './components/route-days/route-days.component';
import { RouteDetailsComponent } from './components/route-details/route-details.component';
import { VehicleTypeComponent } from './components/vehicle-type/vehicle-type.component';
import { VehicleComponent } from './components/vehicle/vehicle.component';
import { TripComponent } from './components/trip/trip.component';
import { TripDaysComponent } from './components/trip-days/trip-days.component';
import { ViewTripComponent } from './components/view-trip/view-trip.component';
import { ViewTripDetailsComponent } from './components/view-trip-details/view-trip-details.component';
import { RouteMapComponent } from './components/route-map/route-map.component';
import { TripListComponent } from './components/trip-list/trip-list.component';
import { ViewRouteOrderComponent } from './components/view-route-order/view-route-order.component';
import { RouteOrderComponent } from './components/route-order/route-order.component';
import { ViewRouteOrderDetailsComponent } from './components/view-route-order-details/view-route-order-details.component';

const routes: Routes = [
  {path: '', component: ManageRouteComponent},
  {path: 'route', component: RouteComponent},
  {path: 'routedays', component: RouteDaysComponent},
  {path: 'routedetails', component: RouteDetailsComponent},
  {path: 'vehicletype', component: VehicleTypeComponent},
  {path: 'vehicle', component: VehicleComponent},
  {path: 'viewmap', component: RouteMapComponent},

  {path: 'trip', component: TripComponent},
  {path: 'trip/:id', component: TripComponent},
  {path: 'viewtrip', component: ViewTripComponent},
  {path: 'viewtrip/details/:id', component: ViewTripDetailsComponent},
  {path: 'viewtrip/details/list/:id/:routeId', component: TripListComponent},
  {path: 'tripdays', component: TripDaysComponent},

  {path: 'viewrouteorder', component: ViewRouteOrderComponent},
  {path: 'viewrouteorder/details/:id', component: ViewRouteOrderDetailsComponent},
  {path: 'routeorder', component: RouteOrderComponent},
  {path: 'routeorder/:id', component: RouteOrderComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RouteRoutingModule { }
