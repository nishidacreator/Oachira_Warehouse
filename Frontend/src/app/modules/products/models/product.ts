import { SubCategory } from './sub-category';
import { Brand } from "./brand";
import { Category } from './category';
import { Gst } from './gst';
import { PrimaryUnit } from './primary-unit';
import { Hsn } from './hsn';

export interface Product {
  id : number;
  productName : string;
  code : string;
  barCode : string;
  categoryId : number;
  subCategoryId : number;
  brandId : number
  locationId : number;
  gstId : number;
  hsnId : number;
  reorderQuantity : number;
  warehouseLoyalityPoint : number, 
   retailLoyalityPoint : number,
   isSpecial : boolean,
   isRouteItem : boolean;
   openingStock : boolean;
   brokerageItem : boolean;
   primaryUnitId:number,
  status : string;
  baseUnitId : number;


  cloudinaryId : string;
  fileUrl : string;

  brand : Brand;
  category : Category;
  subCategory : SubCategory;
  location : Location;
  baseUnit : PrimaryUnit;
  gst : Gst
  hsn : Hsn
}
