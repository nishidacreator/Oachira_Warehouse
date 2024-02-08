import { CustomerComponent } from './components/customer/customer.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageCustomersComponent } from './components/manage-customers/manage-customers.component';
import { CustomerCategoryComponent } from './components/customer-category/customer-category.component';
import { CustomerGradeComponent } from './components/customer-grade/customer-grade.component';

const routes: Routes = [
  {path: '', component:ManageCustomersComponent},
  {path: 'category', component:CustomerCategoryComponent},
  {path: 'grade', component:CustomerGradeComponent},
  {path: 'add', component:CustomerComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule { }
