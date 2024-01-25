import { Product } from "../../products/models/product"
import { SecondaryUnit } from "../../products/models/secondary-unit"
import { PurchaseRequest } from "./purchase-request"

export interface PurchaseRequestDetail {
  requestId : number
  productId : number
  quantity : number
  secondaryUnitId : number

  request : PurchaseRequest
  product : Product
  secondaryUnit : SecondaryUnit
}
