import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ToolbarService, PageService, ExcelExportService, PdfExportService, GridComponent, PdfExportProperties } from '@syncfusion/ej2-angular-grids';
import { environment } from 'src/environments/environment';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
import { ActivatedRoute } from '@angular/router';
import { PurchaseService } from '../../purchase.service';
import { PurchaseRequest } from '../../models/purchase-request';
import { Subscription } from 'rxjs';
import { PurchaseRequestDetail } from '../../models/purchase-request-detail';
@Component({
  selector: 'app-view-pr',
  templateUrl: './view-pr.component.html',
  styleUrls: ['./view-pr.component.scss'],
  providers: [ToolbarService, PageService, ExcelExportService, PdfExportService],
})
export class ViewPrComponent implements OnInit, OnDestroy {

  dirToPrint!: ViewPrComponent;

  constructor(private route: ActivatedRoute, private purchaseService: PurchaseService) { }

  ngOnDestroy(): void {
    this.requestSub.unsubscribe();
  }

  requestId!: number
  ngOnInit(): void {
    this.requestId = this.route.snapshot.params['id'];

    this.getRequestId();
  }

  requests!: PurchaseRequest;
  requestDetails: PurchaseRequestDetail[] = [];
  requestSub!: Subscription;
  getRequestId(){
    this.requestSub = this.purchaseService.getPRById(this.requestId).subscribe(data => {
      this.requests = data
      this.requestDetails = data.requestDetails;

    })
  }

  // testData = {
  //   number: "123",
  //   seller: {
  //     name: "Next Step Webs, Inc.",
  //     road: "12345 Sunny Road",
  //     country: "Sunnyville, TX 12345",
  //   },
  //   buyer: {
  //     name: "Acme Corp.",
  //     road: "16 Johnson Road",
  //     country: "Paris, France 8060",
  //   },
  //   items: [
  //     {
  //       name: "Website design",
  //       price: 300,
  //     },
  //   ],
  // };

  @ViewChild("grid") grid!: GridComponent;
  public pdfExportProperties: PdfExportProperties | undefined;
  public toolbar: string[] | undefined;
  ngAfterViewInit(): void {
    this.toolbar = ["PdfExport"];
  }

  pdfprint = true;
  toolbarClick(args: ClickEventArgs): void {
    this.onPdfExport(args);
    // console.log(this.combinedArray, this.grid);
    switch (args.item.id) {
      case "AdvancedExport_pdfexport":
        this.grid.pdfExport(this.getPdfExportProperties());
        break;
    }
  }

  private getDate(): string {
    let date: string = "";
    date +=
      new Date().getMonth().toString() + "/" + new Date().getDate().toString();
    return (date += "/" + new Date().getFullYear().toString());
  }

  onPdfExport(args: any): void {
    args.item.width = 148; // Set the page size to 148 mm x 210 mm
  }

  print() {
    (this.grid as GridComponent).print();
  }

  private getPdfExportProperties(): any {
    return {
      pageSettings: {
        width: 80, // Specify the width in millimeters
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
    // const ps = new ThermalPrinterManager();
    // ps.addLineWithClassName(`text-center font-bold`, `PURCHASE REQUEST`);
    // ps.addLineCenter(this.requests.store.storeName);
    // ps.addLineCenter(this.requests.store.storeLocation);

    // ps.addEmptyLine();

    // ps.addLine(`<div style="display: flex; justify-content: space-between;">RequestNo: <span>${this.requests.requestNo}</span></div>`);
    // ps.addLine(`<div style="display: flex; justify-content: space-between;">Date: <span>${this.requests.date}</span></div>`);
    // ps.addLine(`<div style="display: flex; justify-content: space-between;">SendBy: <span>${this.requests.user.name}</span></div>`);

    // ps.addEmptyLine();

    // // Table header
    // ps.addLine('<div style="display: flex; justify-content: space-between; font-weight: bold;">');
    // ps.addLine('<div style="flex: 1;">Product</div>');
    // ps.addLine('<div style="flex: 1;">Quantity</div>');
    // ps.addLine('<div style="flex: 1;">Unit</div>');
    // ps.addLine('</div>');
    // ps.addEmptyLine();

    // // Table rows
    // for (let i = 0; i < this.requestDetails.length; i++) {
    //   ps.addLine('<div style="display: flex; justify-content: space-between;">');
    //   ps.addLine(`<div style="flex: 1;">${this.requestDetails[i].product.productName}</div>`);
    //   ps.addLine(`<div style="flex: 1;">${this.requestDetails[i].quantity}</div>`);
    //   ps.addLine(`<div style="flex: 1;">${this.requestDetails[i].secondaryUnit.secondaryUnitName}</div>`);
    //   ps.addLine('</div>');
    // }


    // ps.addEmptyLine();
    // ps.addLine(`Ticket #1 - Walk-in`);
    // ps.print();
    // this.dirToPrint.print();
  }
}

class ThermalPrinterManager {
  // styles = StyleSheet.create({
  //   red: {
  //     backgroundColor: "red"
  //   },

  //   blue: {
  //     backgroundColor: "blue"
  //   },

  //   hovered: {
  //     backgroundColor: 'red',
  //   },

  //   // small: {
  //   //   "@media (max-width: 600px)": {
  //   //     backgroundColor: "red"
  //   //   }
  //   // }

  // });

  printContent = ``;

  addRawHtml(htmlEl: any) {
    this.printContent += `\n${htmlEl}`;
  }

  addLine(text: any) {
    this.addRawHtml(`<p>${text}</p>`);
  }

  addLineWithClassName(className: any, text: any) {
    this.addRawHtml(`<p class="${className}">${text}</p>`);
  }

  addEmptyLine() {
    this.addLine('----------------------------------------');
    this.addLine(`&nbsp;`);
  }

  addLineCenter(text: any) {
    this.addLineWithClassName("text-center", text);
  }

  print() {
    const printerWindow = window.open(``, `_blank`);
    const contentHeight = this.calculateContentHeight(); // Add a function to calculate content height
    console.log(contentHeight);

    printerWindow?.document.write(`
    <!DOCTYPE html>
    <html>

    <head>
      <title>Print</title>
      <style>

        html {
          padding: 0;
          margin: 0;
          font-family: monospace;
          width: 80mm;
        }

        body {
          margin: 0;
          padding: 8px;
        }

        p {
          margin-top: 0.25rem;
          margin-bottom: 0.25rem;
          white-space: pre-wrap;
        }

        .text-center {
          text-align: center;
        }

        .text-right {
          text-align: right;
        }

        .text-left {
          text-align: left;
        }

        .font-bold {
          font-weight: bold;
        }

        table {
          width: 100%;
        }

        tr, th, td {
          padding: 0;
        }

        .grid-line {
          overflow: hidden;
          text-overflow: clip;
          white-space: nowrap;
          grid-column: span 3 / span 3;
        }

        .nowrap {
          overflow: hidden;
          text-overflow: clip;
          white-space: nowrap;
        }

        .col-span-2 {
          grid-column: span 2 / span 2;
        }

        .max-line-2 {
          max-height: ${contentHeight}px; /* Set to calculated content height */
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

      </style>
      <script>
        window.onafterprint = event => {
          window.close();
        };
      </script>
    </head>

    <body>
      ${this.printContent}
    </body>


    </html>

    `);

    printerWindow?.document.close();
    printerWindow?.focus();
    printerWindow?.print();
    // mywindow.close();
  }

  calculateContentHeight() {
    // Add logic to calculate the content height dynamically
    // You may use document.body.scrollHeight or any other suitable method
    // Adjust this logic based on your specific requirements
    return document.body.scrollHeight;
  }
}
