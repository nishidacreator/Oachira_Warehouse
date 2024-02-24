import { Entry } from "./entry"
import { Transporter } from "./transporter"

export interface PurchaseTransporter {
  id : number
  invoiceNo: string
  transporterId : number
  amount : number
  date: Date
  vehicleNo: string
  from: string
  noOfBags: string
  advance: number
  entryId: number
  status: string
  chequeNo: string
  closedDate: Date

  transporter: Transporter
  entry: Entry
}
