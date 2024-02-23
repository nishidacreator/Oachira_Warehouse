import { Distributor } from "../../products/models/distributor";
import { User } from "../../users/models/user";
import { EntryDetails } from "./entryDetails";
import { PurchaseOrder } from "./purchase-order";
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

    purchaseOrderId : number
    purchaseOrder: PurchaseOrder
    userId : number
    user: User
}
