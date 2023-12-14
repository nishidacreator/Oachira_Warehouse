import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingHomeComponent } from './components/setting-home/setting-home.component';
import { CategoryComponent } from '../products/components/category/category.component';
import { BrandComponent } from '../products/components/brand/brand.component';
import { AuthGuard } from '../shared-components/guards/auth.guard';

const routes: Routes = [
  {path: '', component: SettingHomeComponent},
  {path:'product',loadChildren:()=>import('../../modules/products/products.module').then(x=>x.ProductsModule), canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }