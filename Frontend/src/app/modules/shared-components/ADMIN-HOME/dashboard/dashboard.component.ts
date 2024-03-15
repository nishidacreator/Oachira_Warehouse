import { Component, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
// import { AdminService } from "../../../admin.service";
// import { MasterSearchComponent } from "../../master-search/master-search.component";
import Chart from 'chart.js/auto';
import { EntryCheque } from "src/app/modules/purchase/models/entry-cheque";
import { PurchaseService } from "src/app/modules/purchase/purchase.service";
export interface GroceryProduct {
  serialNumber: number;
  name: string;
  sale: number;
  purchase: number;
}

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent {

  constructor( public dialog: MatDialog, private purchaseService: PurchaseService) {}


  ngOnInit() {

    this.createPurchaseGraph();
    this.createSalesGraph();
    this.getEntryCheque();
  }

  // dataSource = GROCERY_DATA;
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

  cheques: EntryCheque[] = [];
  filtered: EntryCheque[] = [];
  pageSize = 5;
  currentPage = 1;
  totalItems = 0;
  filterValue = "";
  getEntryCheque(){
    this.purchaseService.getEntryChequeByStatus(this.filterValue, this.currentPage, this.pageSize).subscribe((res: any) => {
      console.log(res);

      this.cheques = res.items;
      this.filtered = res.items;
      this.totalItems = res.count;
      console.log(this.filtered);
    });
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    console.log('Current Page:', this.currentPage);
    console.log('Total Items:', this.totalItems);
    this.getEntryCheque();
  }

  applyFilter(event: Event): void {
    if((event.target as HTMLInputElement).value.trim() === '') {
      this.getEntryCheque();
    }else{

      const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
      this.filtered = this.cheques.filter(element =>
        element.chequeNo.toLowerCase().includes(filterValue)
        || element.chequeClearenceDate.toString().includes(filterValue)
        || element.type.toString().includes(filterValue)
    );
    }
  }

  onToggleChange(event: any, id: number) {
    const newValue = event.checked;

    let data = {
      status : newValue
    }
    this.purchaseService.updateChequeStatus(id, data).subscribe(data=>{
      console.log(data);
    });
  }

}
