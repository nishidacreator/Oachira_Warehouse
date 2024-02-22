export interface CustomerLedger {
  id: number;
  customerId : number
  invoiceNo : string
  date : Date
  debit : number
  credit : number
}
