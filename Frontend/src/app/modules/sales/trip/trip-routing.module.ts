import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageTripComponent } from './components/manage-trip/manage-trip.component';

const routes: Routes = [
  {path: '', component: ManageTripComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TripRoutingModule { }
