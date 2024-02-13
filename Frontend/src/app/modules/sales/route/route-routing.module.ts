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

const routes: Routes = [
  {path: '', component: ManageRouteComponent},
  {path: 'route', component: RouteComponent},
  {path: 'routedays', component: RouteDaysComponent},
  {path: 'routedetails', component: RouteDetailsComponent},
  {path: 'vehicletype', component: VehicleTypeComponent},
  {path: 'vehicle', component: VehicleComponent},
  {path: 'trip', component: TripComponent},
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
