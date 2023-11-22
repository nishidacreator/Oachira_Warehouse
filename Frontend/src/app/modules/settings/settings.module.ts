import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingHomeComponent } from './components/setting-home/setting-home.component';
import { MaterialModule } from '../shared-components/material.module';


@NgModule({
  declarations: [
    SettingHomeComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    MaterialModule
  ]
})
export class SettingsModule { }
