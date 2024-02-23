import { Distributor } from "../../products/models/distributor";
import { User } from "../../users/models/user";
import { EntryDetails } from "./entryDetails";
import { Order } from "./order";
// j

export interface Entry{
    id:number,
    purchaseInvoice : string
    purachseDate: Date
    distributorId: number
    distributor: Distributor
    purchaseAmount: number
    status: string
    chequeNo: string
    chequeIssuedDate: Date
    entryStatus: string

    invoiceDate: Date
    transportation: number
    unloading: number
    commission: number
    paymentMode: string
    eWayBillNo: string
    remarks : string

    OrderId : number
    Order: Order
    userId : number
    user: User
}
