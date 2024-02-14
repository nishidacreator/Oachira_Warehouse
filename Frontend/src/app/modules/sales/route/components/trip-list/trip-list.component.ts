import { Component, OnInit, ViewChild } from '@angular/core';
import { SalesService } from '../../../sales.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, forkJoin, map } from 'rxjs';
import { PickListDetails } from '../../models/pick-list-details';
import { HttpClient } from '@angular/common/http';
import { ExcelExportService, GridComponent, PageService, PdfExportProperties, PdfExportService, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-trip-list',
  templateUrl: './trip-list.component.html',
  styleUrls: ['./trip-list.component.scss'],
  providers: [
    ToolbarService,
    PageService,
    ExcelExportService,
    PdfExportService,
  ],
})
export class TripListComponent implements OnInit {

  @ViewChild("grid") grid!: GridComponent;
  public pdfExportProperties: PdfExportProperties | undefined;
  public toolbar: string[] | undefined;

  constructor(
    private route: ActivatedRoute,
    private adminService: SalesService,
    // private sEService: SalesExecutiveService,
    private router: Router,
    private http: HttpClient
  ) {}

  testData = {
    number: "123",
    seller: {
      name: "Next Step Webs, Inc.",
      road: "12345 Sunny Road",
      country: "Sunnyville, TX 12345",
    },
    buyer: {
      name: "Acme Corp.",
      road: "16 Johnson Road",
      country: "Paris, France 8060",
    },
    items: [
      {
        name: "Website design",
        price: 300,
      },
    ],
  };

  ngOnDestroy(): void {
    this.tripSubscription.unsubscribe();
  }

  tripId: any;
  ngOnInit(): void {
    this.tripId = this.route.snapshot.params["id"];

    this.tripSubscription = this.getTrip();
    this.pdfExportProperties = {
      fileName: "pdfdocument.pdf",
      // Other PDF export options
    };
  }

  routeId!: number;
  productList: any[] = [];
  countMapArray: any[] = [];
  combinedArray: { productId: string; productName: string; count: number }[] =
    [];
  tripSubscription!: Subscription;
  pickListId: any;
  getTrip() {
    return this.adminService.getTripById(this.tripId).subscribe((res) => {
      this.routeId = res.routeId;
      this.adminService
        .getPickListByRouteId(this.routeId)
        .pipe(map((x) => x.filter((y) => y.status === "pending")))
        .subscribe((res) => {
          const observables = res.map((pick) => {
            return this.adminService.getPickListDetails(pick.id);
          });

          forkJoin(observables).subscribe((pickListDetails) => {
            const countMap = new Map<any, any>(); // Map to store productId and its count
            const productMap = new Map<any, any>();

            for (let i = 0; i < pickListDetails.length; i++) {
              // for (let j = 0; j < pickListDetails[i].length; j++) {
              //   this.productList.push(pickListDetails[i][j]);

              //   const productId = pickListDetails[i][j].product.id;
              //   const productCount = pickListDetails[i][j].quantity;
              //   const productName = pickListDetails[i][j].product.productName;

              //   if (countMap.has(productId)) {
              //     countMap.set(
              //       productId,
              //       countMap.get(productId) + productCount
              //     );
              //   } else {
              //     countMap.set(productId, productCount);
              //   }

              //   if (!productMap.has(productId)) {
              //     productMap.set(productId, productName);
              //   }
              // }
            }
            for (const [productId, count] of countMap) {
              const productName = productMap.get(productId);
              this.combinedArray.push({ productId, productName, count });
            }
          });
        });
    });
  }

  viewDetails(id: any) {
    this.router.navigateByUrl(
      "/admin/sales/viewpicklist/triplist/products/view/" +
        id +
        "/" +
        this.routeId
    );
  }

  ngAfterViewInit(): void {
    this.toolbar = ["PdfExport"];
  }
  pdfprint = true;
  // toolbarClick(args: ClickEventArgs): void {
  //   this.onPdfExport(args);
  //   console.log(this.combinedArray, this.grid);
  //   switch (args.item.id) {
  //     case "AdvancedExport_pdfexport":
  //       this.grid.pdfExport(this.getPdfExportProperties());
  //       break;
  //   }
  // }
  // toolbarClick(args: ClickEventArgs): void {
  //   if (this.grid && args.item.id === 'AdvancedExport_pdfexport' && this.grid.pdfExport) {
  //     this.grid.pdfExport(this.getPdfExportProperties());
  //   }
  // }

  private getDate(): string {
    let date: string = "";
    date +=
      new Date().getMonth().toString() + "/" + new Date().getDate().toString();
    return (date += "/" + new Date().getFullYear().toString());
  }
  onPdfExport(args: any): void {
    console.log("hello");
    console.log(args.item);
    args.item.width = 148; // Set the page size to 148 mm x 210 mm
  }

  print() {
    (this.grid as GridComponent).print();
  }

  private getPdfExportProperties(): any {
    return {
      pageSettings: {
        width: 74, // Specify the width in millimeters
        height: 52, // Specify the height in millimeters
      },
      header: {
        fromTop: 0,
        height: 120,
        contents: [
          {
            type: "Text",
            value: "INVOICE",
            position: { x: 280, y: 0 },
            style: { textBrushColor: "#C25050", fontSize: 25 },
          },
        ],
      },
      footer: {
        fromBottom: 160,
        height: 100,
        contents: [
          {
            type: "Text",
            value: "Thank you for your business !",
            position: { x: 250, y: 20 },
            style: { textBrushColor: "#C67878", fontSize: 14 },
          },
          {
            type: "Text",
            value: "! Visit Again hello !",
            position: { x: 300, y: 45 },
            style: { textBrushColor: "#C67878", fontSize: 14 },
          },
        ],
      },

      fileName: "pdfdocument.pdf",
    };
  }

  saveAndDownload(): void {
    this.http
      .post(`${environment.baseUrl}/download`, this.combinedArray, {
        responseType: "blob",
      })
      .subscribe((response) => {
        if (response) {
          // Create a Blob from the response with the correct media type
          const blob = new Blob([response], { type: "application/pdf" });

          // Create a URL for the Blob and open it in a new window/tab
          const finalUrl = URL.createObjectURL(blob);
          window.open(finalUrl, "_blank");
        }
      });
  }
}

