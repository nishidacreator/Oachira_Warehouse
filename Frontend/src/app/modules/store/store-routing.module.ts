import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageStoreComponent } from './components/manage-store/manage-store.component';
import { StoreComponent } from './components/store/store.component';

const routes: Routes = [
  {path: '', component: ManageStoreComponent},
  {path: 'store', component: StoreComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoreRoutingModule { }
