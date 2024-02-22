import { User } from "src/app/modules/users/models/user";
import { RouteEntryDetails } from "./route-entry-details";
import { RouteOrder } from "./route-order";

export interface RouteEntry {
  id: number;
  routeSOId : number
  routeSO : RouteOrder
  invoiceNo : string
  totalAmount : number
  userId : number
  user: User
  paymentMode : string
  invoiceDate : Date
  creditBalance: number
  status : string
  routeSEDetails : RouteEntryDetails[]
}
