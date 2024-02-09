
import { Customer } from "../../customers/models/customer"
import { Route } from "./route"

export interface RouteDetails {
  id : number,
  routeId : number,
  route : Route
  customerId : number,
  customer : Customer
  routeIndex : number
  status : boolean
}
