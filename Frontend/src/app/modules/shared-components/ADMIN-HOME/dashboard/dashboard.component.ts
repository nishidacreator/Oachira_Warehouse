import { Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
// import { AdminService } from "../../../admin.service";
// import { MasterSearchComponent } from "../../master-search/master-search.component";
import Chart from 'chart.js/auto';
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
    this.createSalesGraph();
    this.createPurchaseGraph();
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

  createSalesGraph() {
    const ctx = document.getElementById('salesChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
          label: 'Sales',
          data: [15, 29, 40, 51, 56, 55, 90],
          borderColor: 'rgba(75, 192, 192, 1)',
          fill: false
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  createPurchaseGraph() {
    const ctx = document.getElementById('purchaseChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
          label: 'Purchases',
          data: [15, 19, 10, 81, 46, 145, 190],
          borderColor: 'rgba(255, 99, 132, 1)',
          fill: false
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
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
