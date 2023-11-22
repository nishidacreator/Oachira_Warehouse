import { AddComponent } from './../products/components/add/add.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../shared-components/ADMIN-HOME/dashboard/dashboard.component';
import { NavbarComponent } from '../shared-components/ADMIN-HOME/navbar/navbar.component';
import { AuthGuard } from '../shared-components/guards/auth.guard';
import { SettingHomeComponent } from './components/setting-home/setting-home.component';

const routes: Routes = [
  {path: '', component: SettingHomeComponent},
  {path: 'product', component: AddComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
