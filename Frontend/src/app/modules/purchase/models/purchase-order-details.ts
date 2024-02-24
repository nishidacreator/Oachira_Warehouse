import { Product } from "../../products/models/product"
import { SecondaryUnit } from "../../products/models/secondary-unit"
import { Order } from "./order";
import { PurchaseRequest } from "./purchase-request"

export interface PurchaseOrderDetails {
  orderId : number;
  productId : number
  quantity : number
  secondaryUnitId : number;

  order : Order;
  product : Product;
  secondaryUnit :SecondaryUnit;

}
