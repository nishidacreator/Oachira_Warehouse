import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsModule } from '../settings/settings.module';
import { AuthGuard } from './guards/auth.guard';
// import { NavbarComponent } from './components/ADMIN-HOME/navbar/navbar.component';
// import { DashboardComponent } from './components/ADMIN-HOME/dashboard/dashboard.component';

const routes: Routes = [
  {path:'settings',loadChildren:()=>import('../settings/settings.module').then(x=>x.SettingsModule), canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SharedComponentsRoutingModule { }
