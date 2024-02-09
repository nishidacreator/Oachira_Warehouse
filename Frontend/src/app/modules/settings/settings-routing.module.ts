import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingHomeComponent } from './components/setting-home/setting-home.component';
import { CategoryComponent } from '../products/components/category/category.component';
import { BrandComponent } from '../products/components/brand/brand.component';
import { AuthGuard } from '../shared-components/guards/auth.guard';

const routes: Routes = [
  {path: '', component: SettingHomeComponent},
  {path:'product', loadChildren:()=>import('../../modules/products/products.module').then(x=>x.ProductsModule), canActivate: [AuthGuard]},
  {path:'user', loadChildren:()=>import('../../modules/users/users.module').then(x=>x.UsersModule), canActivate: [AuthGuard]},
  {path:'store', loadChildren:()=>import('../../modules/store/store.module').then(x=>x.StoreModule), canActivate: [AuthGuard]},
  {path:'sales', loadChildren:()=>import('../../modules/sales/sales.module').then(x=>x.SalesModule), canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
