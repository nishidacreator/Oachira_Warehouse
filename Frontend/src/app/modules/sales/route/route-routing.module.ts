import { NgModule } from '@angular/core';
import { RouteConfigLoadStart, RouterModule, Routes } from '@angular/router';
import { ManageRouteComponent } from './components/manage-route/manage-route.component';
import { RouteComponent } from './components/route/route.component';
import { RouteDaysComponent } from './components/route-days/route-days.component';
import { RouteDetailsComponent } from './components/route-details/route-details.component';
import { VehicleTypeComponent } from './components/vehicle-type/vehicle-type.component';
import { VehicleComponent } from './components/vehicle/vehicle.component';
import { TripComponent } from './components/trip/trip.component';
import { PickListComponent } from './components/pick-list/pick-list.component';
import { TripDaysComponent } from './components/trip-days/trip-days.component';
import { ViewPickListComponent } from './components/view-pick-list/view-pick-list.component';
import { ViewPickListDetailsComponent } from './components/view-pick-list-details/view-pick-list-details.component';
import { ViewTripComponent } from './components/view-trip/view-trip.component';
import { ViewTripDetailsComponent } from './components/view-trip-details/view-trip-details.component';
import { RouteMapComponent } from './components/route-map/route-map.component';
import { TripListComponent } from './components/trip-list/trip-list.component';

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

  {path: 'viewpicklist', component: ViewPickListComponent},
  {path: 'viewpicklist/details/:id', component: ViewPickListDetailsComponent},
  {path: 'picklist', component: PickListComponent},
  {path: 'picklist/:id', component: PickListComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RouteRoutingModule { }
