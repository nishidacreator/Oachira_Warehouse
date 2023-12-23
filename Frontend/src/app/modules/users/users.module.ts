import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../shared-components/material.module';

import { UsersRoutingModule } from './users-routing.module';

import { LoginComponent } from '../shared-components/login/login.component';
import { RegisterComponent } from '../shared-components/register/register.component';
import { RoleComponent } from './components/role/role.component';
import { ManageUsersComponent } from './components/manage-users/manage-users.component';
import { UsersComponent } from './components/users/users.component';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    RoleComponent,
    ManageUsersComponent,
    UsersComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    MaterialModule,
  ]
})
export class UsersModule { }
