// import { Store } from "../../store/models/store"
import { company } from "../../company/models/company";
import { User } from "../../users/models/user"
import { PurchaseRequestDetail } from "./purchase-request-detail";

export interface PurchaseRequest {
  id : number;
  companyId : number
  userId : number
  date : Date
  status : string
  requestNo : string
  // store : Store
  user : User
  requestDetails : PurchaseRequestDetail[]
  company: company
}
