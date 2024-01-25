import { CustomerCategory } from "./customer-category"
import { CustomerGrade } from "./customer-grade"

export interface Customer {
  id : number;
  name : string
  phoneNumber : string
  address1 : string
  address2 : string
  state : string
  loyaltyPoint : string
  customerCategoryId : number
  customerGradeId : number
  subledgerCode : string
  gstNo : string
  remarks : string
  customerCategory : CustomerCategory
  customerGrade : CustomerGrade
}
