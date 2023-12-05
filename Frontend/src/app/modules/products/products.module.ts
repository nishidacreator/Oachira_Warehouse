import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../shared-components/material.module';

import { ProductsRoutingModule } from './products-routing.module';
import { ManageComponent } from './components/manage/manage.component';
import { CategoryComponent } from './components/category/category.component';
import { ProductComponent } from './components/product/product.component';
import { BrandComponent } from './components/brand/brand.component';
import { SubcategoryComponent } from './components/subcategory/subcategory.component';
import { UnitComponent } from './components/unit/unit.component';


@NgModule({
  declarations: [
    ManageComponent,
    CategoryComponent,
    ProductComponent,
    BrandComponent,
    SubcategoryComponent,
    UnitComponent
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    MaterialModule
  ]
})
export class ProductsModule { }
