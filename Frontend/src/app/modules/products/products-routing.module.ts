import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../shared-components/ADMIN-HOME/dashboard/dashboard.component';
import { NavbarComponent } from '../shared-components/ADMIN-HOME/navbar/navbar.component';
import { SettingsModule } from '../settings/settings.module';
import { AuthGuard } from '../shared-components/guards/auth.guard';

const routes: Routes = [
  {path: '', component:NavbarComponent,
  children: [
    {path: '', component: DashboardComponent},
    {path:'settings',loadChildren:()=>import('../settings/settings.module').then(x=>x.SettingsModule), canActivate: [AuthGuard]},
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
