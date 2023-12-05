import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from '../shared-components/guards/auth.guard';

const routes: Routes = [
  {path: '', component:LoginComponent},
  {path:'register', component: RegisterComponent},
  {path:'settings',loadChildren:()=>import('../settings/settings.module').then(x=>x.SettingsModule), canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
