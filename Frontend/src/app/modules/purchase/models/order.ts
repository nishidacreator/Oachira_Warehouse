import { company } from "../../company/models/company";
import { Distributor } from "../../products/models/distributor";
import { User } from "../../users/models/user";
import { PurchaseOrderDetails } from "./purchase-order-details";

export interface Order {
  id: number;
  orderNo: string;
  distributorId :number
  userId :number
  companyId :number;
  // warehouseId:number
  date: Date;
  status: string;
  distributor :Distributor ,
  company:company,
  orderDetails:PurchaseOrderDetails[]
 user: User

}
