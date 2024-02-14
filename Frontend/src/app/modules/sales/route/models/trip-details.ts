import { Customer } from "../../customers/models/customer"

export interface TripDetails {
  tripId : number
  customerId  : number
  amount : number
  invoiceNo : string
  status : boolean
  customer : Customer
}
