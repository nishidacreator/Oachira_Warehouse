import { Broker } from "./broker"
import { Entry } from "./entry"

export interface BrokerAccount {
  brockerId : number
  entryId : number
  date : Date
  bagNo : number
  amount : number
  status : string
  invoiceNo: string

  id: number;
  brocker: Broker
  entry: Entry
}
