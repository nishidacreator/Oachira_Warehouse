import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentsRoutingModule } from './shared-components-routing.module';
import { DashboardComponent } from './ADMIN-HOME/dashboard/dashboard.component';
import { NavbarComponent } from './ADMIN-HOME/navbar/navbar.component';

import {MatIconModule} from '@angular/material/icon';
import { MaterialModule } from './material.module';
@NgModule({
  declarations: [
    DashboardComponent,
    NavbarComponent
  ],
  imports: [
    CommonModule,
    SharedComponentsRoutingModule,
    MaterialModule,
    MatIconModule
  ]
})
export class SharedComponentsModule { }
