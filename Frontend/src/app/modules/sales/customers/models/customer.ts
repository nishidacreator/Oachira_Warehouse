import { CustomerCategory } from "./customer-category";
import { CustomerGrade } from "./customer-grade";
import { CustomerPhone } from "./customer-phone";

export interface Customer {
  id: number;
  name : string
  subledgerCode : string
  address1 : string
  address2 : string
  state : string
  email: string
  gstNo : string
  remarks : string
  loyaltyPoint : string
  customerCategoryId : number
  customerGradeId : number
  customerCategory : CustomerCategory
  customerGrade : CustomerGrade
  customerPhones : CustomerPhone[];
}
