import { Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
// import { AdminService } from "../../../admin.service";
// import { MasterSearchComponent } from "../../master-search/master-search.component";

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
  stockCount=0;
  constructor( public dialog: MatDialog) {}

  ngOnInit() {
    // this.getPendingRfqs();
    // this.getSaleCount();
    // this.getSales();
    // this.getTopSellingParts();
    // this.getQuotCount();
    // this.getStockCount();
  }
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
