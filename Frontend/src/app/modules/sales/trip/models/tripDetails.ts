import { Customer } from "../../customers/models/customer"
import { Trip } from "./trip"

export interface TripDetails{
    id : number
    tripId : number
    trip : Trip
    customerId  : number
    customer : Customer
    amount : number
    invoiceNo : string
    status : boolean
}
