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
import { LocationComponent } from './components/location/location.component';
import { HsnComponent } from './components/hsn/hsn.component';
import { GstComponent } from './components/gst/gst.component';
import { DistributorComponent } from './components/distributor/distributor.component';
import { ProductDistributorComponent } from './components/product-distributor/product-distributor.component';


@NgModule({
  declarations: [
    ManageComponent,
    CategoryComponent,
    ProductComponent,
    BrandComponent,
    SubcategoryComponent,
    UnitComponent,
    LocationComponent,
    HsnComponent,
    GstComponent,
    DistributorComponent,
    ProductDistributorComponent
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    MaterialModule
  ]
})
export class ProductsModule { }
