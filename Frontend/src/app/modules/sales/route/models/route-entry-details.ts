import { Product } from "src/app/modules/products/models/product";
import { SecondaryUnit } from "src/app/modules/products/models/secondary-unit";
import { RouteEntry } from "./route-entry";

export interface RouteEntryDetails {
  id: number;
  routeSEId : number
  productId  : number
  quantity : number
  secondaryUnitId : number
  hsnCode : string
  gst : string
  rate : number
  amount : number
  mrp : number

  product: Product
  secondaryUnit: SecondaryUnit
  routeSE: RouteEntry
}
