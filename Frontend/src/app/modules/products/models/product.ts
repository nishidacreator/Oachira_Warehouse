import { SubCategory } from './sub-category';
import { Brand } from "./brand";
import { Category } from './category';

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
  loyaltyPoint : number;
  status : string;

  cloudinaryId : string;
  fileUrl : string;

  brand : Brand;
  category : Category;
  subCategory : SubCategory;
  location : Location;
  // gst : Gst
  // hsn : HSN
}
