import { Product } from "../../products/models/product";
import { SecondaryUnit } from "../../products/models/secondary-unit";
import { Entry } from "./entry";

export interface EntryDetails {
  id : number;
  entryId: number
  entry: Entry
  productId : number
  product: Product
  quantity : number
  secondaryUnitId : number
  secondaryUnit: SecondaryUnit
  mrp:number
  rate:number
  discount : number
  gstId : number
  grossAmount: number
  netAmount :  number
  taxableAmount: number
}
