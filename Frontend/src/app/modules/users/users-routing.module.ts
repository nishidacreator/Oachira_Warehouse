import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../shared-components/login/login.component';
import { RegisterComponent } from '../shared-components/register/register.component';
import { AuthGuard } from '../shared-components/guards/auth.guard';
import { ManageUsersComponent } from './components/manage-users/manage-users.component';
import { RoleComponent } from './components/role/role.component';
import { UsersComponent } from './components/users/users.component';

const routes: Routes = [
  {path: '', component:ManageUsersComponent},
  {path: 'role', component:RoleComponent},
  {path: 'add', component:UsersComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
