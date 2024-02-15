import { Product } from "src/app/modules/products/models/product";
import { SecondaryUnit } from "src/app/modules/products/models/secondary-unit";
import { RouteOrder } from "./route-order";

export interface RouteOrderDetails {
  id: number;
  routeOrderId : number
  routeOrder: RouteOrder
  productId  : number
  product : Product
  quantity : number
  secondaryUnitId : number
  secondaryUnit: SecondaryUnit
}


