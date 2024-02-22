export interface PurchaseOrder {
  id: number;
  orderNo: string;
  distributorId :number
  userId :number
  // warehouseId:number
  date: Date;
  status: string;
}
