import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../shared-components/ADMIN-HOME/dashboard/dashboard.component';
import { NavbarComponent } from '../shared-components/ADMIN-HOME/navbar/navbar.component';
import { SettingsModule } from '../settings/settings.module';
import { AuthGuard } from '../shared-components/guards/auth.guard';
import { ManageComponent } from './components/manage/manage.component';
import { CategoryComponent } from './components/category/category.component';
import { BrandComponent } from './components/brand/brand.component';
import { SubcategoryComponent } from './components/subcategory/subcategory.component';
import { UnitComponent } from './components/unit/unit.component';
import { ProductComponent } from './components/product/product.component';

const routes: Routes = [
  {path: '', component:ManageComponent},
  // children: [
    {path: 'category', component: CategoryComponent},
    {path: 'brand', component: BrandComponent},
    {path: 'subcategory', component: SubcategoryComponent},
    {path: 'unit', component: UnitComponent},
    {path: 'add', component: ProductComponent},
  // ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
