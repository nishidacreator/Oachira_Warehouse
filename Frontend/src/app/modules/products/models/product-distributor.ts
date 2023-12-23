import { Distributor } from "./distributor";
import { Product } from "./product";

export interface ProductDistributor {
  id: number;
  productId: number;
  distributorId: number;
  status: boolean;
  product: Product;
  distributor: Distributor;
}
