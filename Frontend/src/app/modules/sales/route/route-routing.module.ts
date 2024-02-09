import { NgModule } from '@angular/core';
import { RouteConfigLoadStart, RouterModule, Routes } from '@angular/router';
import { ManageRouteComponent } from './components/manage-route/manage-route.component';
import { RouteComponent } from './components/route/route.component';
import { RouteDaysComponent } from './components/route-days/route-days.component';
import { RouteDetailsComponent } from './components/route-details/route-details.component';
import { VehicleTypeComponent } from './components/vehicle-type/vehicle-type.component';
import { VehicleComponent } from './components/vehicle/vehicle.component';

const routes: Routes = [
  {path: '', component: ManageRouteComponent},
  {path: 'route', component: RouteComponent},
  {path: 'routedays', component: RouteDaysComponent},
  {path: 'routedetails', component: RouteDetailsComponent},
  {path: 'vehicletype', component: VehicleTypeComponent},
  {path: 'vehicle', component: VehicleComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RouteRoutingModule { }
