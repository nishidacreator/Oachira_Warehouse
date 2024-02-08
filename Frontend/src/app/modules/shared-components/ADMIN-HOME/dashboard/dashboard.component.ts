import { Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
// import { AdminService } from "../../../admin.service";
// import { MasterSearchComponent } from "../../master-search/master-search.component";

export interface GroceryProduct {
  serialNumber: number;
  name: string;
  sale: number;
  purchase: number;
}

const GROCERY_DATA: GroceryProduct[] = [
  { serialNumber: 1, name: 'Apple', sale: 2, purchase: 1 },
  { serialNumber: 2, name: 'Banana', sale: 1, purchase: 1 },
  { serialNumber: 3, name: 'Carrot', sale: 1, purchase: 1 },
  { serialNumber: 4, name: 'Tomato', sale: 3, purchase: 2 },
  { serialNumber: 5, name: 'Potato', sale: 2, purchase: 1 },
  { serialNumber: 6, name: 'Milk', sale: 4, purchase: 3 },
  { serialNumber: 7, name: 'Bread', sale: 2, purchase: 1 },
  { serialNumber: 8, name: 'Eggs', sale: 1, purchase: 1 },
  { serialNumber: 9, name: 'Cheese', sale: 5, purchase: 4 },
];
@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent {
  pendingRfqs!: number;
  saleCount!: any;
  quotCount:any;
  sales: any;
  topSellingParts: any;
  stockCount!: number;
  constructor( public dialog: MatDialog) {}


  ngOnInit() {
    // this.getPendingRfqs();
    // this.getSaleCount();
    // this.getSales();
    // this.getTopSellingParts();
    // this.getQuotCount();
    // this.getStockCount();
  }
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = GROCERY_DATA;
  // openFullScreenDialog(searchValue: string) {
  //   console.log(searchValue);
  //   const dialogRef = this.dialog.open(MasterSearchComponent, {
  //     maxWidth: "100vw",
  //     maxHeight: "100vh",
  //     width: "100%",
  //     height: "100%",
  //     data: { searchValue }, // Pass the searchValue to the dialog component
  //   });
  //   console.log(dialogRef);
  //   dialogRef.afterClosed().subscribe((result) => {
  //     console.log(`Dialog result: ${result}`);
  //   });
  // }
  // getPendingRfqs() {
  //   this.adminService.getPendingRfqsCount().subscribe((res: any) => {
  //     this.pendingRfqs = res;
  //   });
  // }
  // getSaleCount() {
  //   this.adminService.getSaleCount().subscribe((res: any) => {
  //     this.saleCount = res;
  //   });
  // }

  // getQuotCount() {
  //   this.adminService.getQuotCount().subscribe((res: any) => {
  //     this.quotCount = res;
  //   });
  // }
  // getStockCount() {
  //   this.adminService.getStockCount().subscribe((res: any) => {
  //     this.stockCount = res;
  //   });
  // }


  // getSales() {
  //   this.adminService.getSales().subscribe((res: any) => {
  //     this.sales = res;
  //   });
  // }
  // getTopSellingParts() {
  //   this.adminService.getTopSellingParts().subscribe((res: any) => {
  //     this.topSellingParts = res;
  //   });
  // }

}
