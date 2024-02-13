import { User } from "src/app/modules/users/models/user";
import { Customer } from "../../customers/models/customer";
import { Route } from "./route";
import { PickListDetails } from "./pick-list-details";

export interface PickList {
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
  pickListDetails : PickListDetails[]
}
