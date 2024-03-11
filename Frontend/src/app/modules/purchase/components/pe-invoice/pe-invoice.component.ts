import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PurchaseService } from '../../purchase.service';
import { Entry } from '../../models/entry';
import { EntryDetails } from '../../models/entryDetails';
import { Subscription } from 'rxjs';
import { GridComponent, PdfExportProperties } from '@syncfusion/ej2-angular-grids';

@Component({
  selector: 'app-pe-invoice',
  templateUrl: './pe-invoice.component.html',
  styleUrls: ['./pe-invoice.component.scss']
})
export class PeInvoiceComponent implements OnInit {

  constructor(private route: ActivatedRoute, private purchaseService: PurchaseService) { }

  ngOnDestroy(): void {
    this.requestSub.unsubscribe();
  }

  poId!: number
  ngOnInit(): void {
    this.poId = this.route.snapshot.params['id'];

    this.getPEById();
  }

  entry!: Entry;
  entryDetails: EntryDetails[] = [];
  requestSub!: Subscription;
  getPEById(){
    this.requestSub = this.purchaseService.getPeById(this.poId).subscribe(data => {
      this.entry = data
      console.log('data:',data)
      this.entryDetails = data.entryDetails;

    })
  }
  printDiv() {
    const divContents = document.getElementById("invoice-box")?.innerHTML;

    if (divContents) {
      const printWindow = window.open('', '', 'width=800,height=600');
      if (printWindow) {
        printWindow.document.write('<html><head><title>Print</title>');
        printWindow.document.write('<style>');
        // Include your CSS styles here
        printWindow.document.write(`
          .invoice-box {
            max-width: 800px;
            margin: auto;
            padding: 20px;
            border: 1px solid #eee;
            box-shadow: 0 0 10px rgba(0, 0, 0, .15);
            font-size: 14px;
            line-height: 24px;
          }
          .address-sections {
            display: flex;
            justify-content: space-between;
          }
          .from-address, .to-address {
            width: 45%;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            border-bottom: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          tr:hover {
            background-color: #f5f5f5;
          }
          .heading {
            background-color: #f2f2f2;
          }
          .item-row td {
            width: 33%;
          }
        `);
        printWindow.document.write('</style></head><body>');
        printWindow.document.write(divContents);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
      }
    }
  }

  @ViewChild("grid") grid!: GridComponent;
  public pdfExportProperties: PdfExportProperties | undefined;
  public toolbar: string[] | undefined;
  ngAfterViewInit(): void {
    this.toolbar = ["PdfExport"];
  }

  pdfprint = true;
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

}

class ThermalPrinterManager {

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
