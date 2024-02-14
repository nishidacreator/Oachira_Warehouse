
import { User } from "src/app/modules/users/models/user";
import { Customer } from "../../customers/models/customer";
import { RouteOrderDetails } from "./route-order-details";
import { Route } from "./route";

export interface RouteOrder {
  id : number;
  routeId : number;
  route : Route
  customerId  : number
  customer : Customer
  date : Date
  status : string
  salesExecutiveId : number
  pickSalesExecutive : User
  deliveryDate : Date
  routeSODetails : RouteOrderDetails[]
}
