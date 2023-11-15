import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './modules/shared-components/guards/auth.guard';

const routes: Routes = [
  {path:'',loadChildren:()=>import('./modules/auth/auth.module').then(x=>x.AuthModule)},
  // {path:'admin',loadChildren:()=>import('./Modules/admin/admin.module').then(x=>x.AdminModule), canActivate: [AuthGuard]},
  // {path:'counter',loadChildren:()=>import('./Modules/counter/counter.module').then(x=>x.CounterModule), canActivate : [AuthGuard]},
  // {path:'salesexecutive',loadChildren:()=>import('./Modules/salesexecutive/salesexecutive.module').then(x=>x.SalesexecutiveModule), canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
