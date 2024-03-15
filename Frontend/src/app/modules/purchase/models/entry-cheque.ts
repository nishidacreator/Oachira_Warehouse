import { Entry } from "./entry";

export interface EntryCheque {
  id: number;
  entryId : number
  chequeNo : string
  amount : number
  chequeIssuedDate : Date
  chequeClearenceDate : Date
  description : string
  status: boolean
  type: string
  entry: Entry
}
