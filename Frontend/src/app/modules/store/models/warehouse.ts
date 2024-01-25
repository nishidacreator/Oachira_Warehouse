import { User } from "../../users/models/user"

export interface Warehouse {
  id : number;
  warehouseName : string
  warehouseLocation : string
  warehouseInChargeId : number
  phoneNumber : string
  panNo : string
  fssaiNo : string
  gstIn : string
  state : string
  warehouseInCharge : User
  status : boolean
}
