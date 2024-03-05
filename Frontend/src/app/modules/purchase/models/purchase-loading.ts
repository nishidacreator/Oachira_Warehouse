import { Entry } from "./entry"
import { LoadingTeam } from "./loading-team"

export interface PurchaseLoading {
  id: number
  entryId: number
  invoiceNo: string
  loadingId : number
  noOfBags: number
  noOfBox: number
  amount : number
  date: Date
  status: string
  closedDate: Date
  entry: Entry
  loading: LoadingTeam
}
