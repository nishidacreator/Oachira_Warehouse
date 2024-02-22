import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyComponent } from './components/company/company.component';
import { ManagaeCompanyComponent } from './components/managae-company/managae-company.component';
import { TeamComponent } from './components/team/team.component';

const routes: Routes = [
  {path: '', component: ManagaeCompanyComponent},
  {path: 'company', component: CompanyComponent},
  {path: 'team', component: TeamComponent},

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyRoutingModule { }
