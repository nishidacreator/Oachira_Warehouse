import { User } from "src/app/modules/users/models/user";
import { Customer } from "../../customers/models/customer";
import { Route } from "./route";


export interface DailyCollection{
    id:number;
    customerId : number,
    amount: number,
    date : Date,
    invoiceNo : string,
    userId : number,
    paymentMode  : string,
    remarks :string,
    routeId : number,
    creditBalance  :number;

    user :User;
    customer :Customer;
    route:Route;
}