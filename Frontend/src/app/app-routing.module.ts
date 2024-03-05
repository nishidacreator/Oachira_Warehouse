import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './modules/shared-components/guards/auth.guard';
import { LoginComponent } from './modules/shared-components/login/login.component';

const routes: Routes = [
  {path:'', loadChildren:()=>import('./modules/shared-components/shared-components.module').then(x=>x.SharedComponentsModule)},
  {path:'products', loadChildren:()=>import('./modules/products/products.module').then(x=>x.ProductsModule), canActivate: [AuthGuard]},

  // {path:'shared',loadChildren:()=>import('./modules/shared-components/shared-components.module').then(x=>x.SharedComponentsModule), canActivate : [AuthGuard]},
  // {path:'salesexecutive',loadChildren:()=>import('./Modules/salesexecutive/salesexecutive.module').then(x=>x.SalesexecutiveModule), canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
