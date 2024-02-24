import { Product } from "../../products/models/product";

export interface Broker {
  id: number;
  productId : number
  brokerName : string
  rate : number
  product: Product
}
