import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../shared-components/guards/auth.guard';

const routes: Routes = [
  {path:'customer', loadChildren:()=>import('../../modules/sales/customers/customers.module').then(x=>x.CustomersModule), canActivate: [AuthGuard]},
  {path:'routesale', loadChildren:()=>import('../../modules/sales/route/route.module').then(x=>x.RouteModule), canActivate: [AuthGuard]},
  {path:'trip', loadChildren:()=>import('../../modules/sales/trip/trip.module').then(x=>x.TripModule), canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRoutingModule { }
