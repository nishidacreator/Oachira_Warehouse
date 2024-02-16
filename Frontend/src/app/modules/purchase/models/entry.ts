import { EntryDetails } from "./entryDetails";


export interface Entry{
    id:number,
    purchaseOrderId:number,
    userId:number,
     purchaseInvoice:string,
     purachseDate :Date,
     paymentMode:string ,
      purchaseAmount:number,
      eWayBillNo:number,
      transportationCharge:number,
      unloading:number ,
      unloadingTeam:string,
      commission:number, 
      chequeNo:number,
      entryDetails:EntryDetails


}