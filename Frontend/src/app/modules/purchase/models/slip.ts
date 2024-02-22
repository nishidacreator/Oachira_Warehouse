import { Distributor } from "../../products/models/distributor";
import { Entry } from "./entry";

export interface Slip {
  id: number;
  purchaseEntryId : number
  invoiceNo : string
  amount: number
  description: string
  date:  Date
  contactPerson: string
  status : string
  distributorId: number
  purchaseInvoice: string
  purchaseEntry: Entry
  distributor: Distributor
}
