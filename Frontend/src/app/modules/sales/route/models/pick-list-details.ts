import { Product } from "src/app/modules/products/models/product";
import { PickList } from "./pick-list";
import { SecondaryUnit } from "src/app/modules/products/models/secondary-unit";

export interface PickListDetails {
  id: number;
  pickListId : number
  pickList: PickList
  productId  : number
  product : Product
  quantity : number
  secondaryUnitId : number
  secondaryUnit: SecondaryUnit
}
