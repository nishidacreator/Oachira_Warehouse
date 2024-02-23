import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../shared-components/material.module';

import { CompanyRoutingModule } from './company-routing.module';
import { ManagaeComponentComponent } from './components/managae-component/managae-component.component';
import { ManagaeCompanyComponent } from './components/managae-company/managae-company.component';
import { CompanyComponent } from './components/company/company.component';
import { TeamComponent } from './components/team/team.component';
import { CompanyBankComponent } from './components/company-bank/company-bank.component';

@NgModule({
  declarations: [
    ManagaeComponentComponent,
    ManagaeCompanyComponent,
    CompanyComponent,
    TeamComponent,
    CompanyBankComponent
  ],
  imports: [
    CommonModule,
    CompanyRoutingModule,
    MaterialModule
  ]
})
export class CompanyModule { }
