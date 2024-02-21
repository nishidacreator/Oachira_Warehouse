import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SalesService } from '../../../sales.service';
import { Subscription, forkJoin } from 'rxjs';
import { PickList } from '../../models/pick-list';
import { ActivatedRoute, Router } from '@angular/router';
import { DeleteDialogueComponent } from 'src/app/modules/shared-components/delete-dialogue/delete-dialogue.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { GridComponent, PdfExportProperties } from '@syncfusion/ej2-angular-grids';

@Component({
  selector: 'app-view-pick-list',
  templateUrl: './view-pick-list.component.html',
  styleUrls: ['./view-pick-list.component.scss']
})
export class ViewPickListComponent implements OnInit, OnDestroy {

  @ViewChild("grid") grid!: GridComponent;
  public pdfExportProperties: PdfExportProperties | undefined;
  public toolbar: string[] | undefined;

  constructor(
    private route: ActivatedRoute,
    private salesService: SalesService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnDestroy(): void {
  }

  tripId!: number;
  routeId!: number;
  ngOnInit(): void {
    this.tripId = this.route.snapshot.params["id"];
    this.routeId = this.route.snapshot.params["routeId"];
    this.pdfExportProperties = {
      fileName: "pdfdocument.pdf",
      // Other PDF export options
    };
    this.getRoute()
  }

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

  combinedArray: any[] = [];
  productList : any[] = [];
  getRoute(){
    this.salesService.getRouteOrderByRouteId(this.routeId).subscribe(x=>{
      this.combinedArray = x.filter(x=>x.status.toLowerCase() === 'invoiceissued')
      const observables = this.combinedArray.map((pick) => {
        return this.salesService.getRouteOrderDetails(pick.id);
      });

      forkJoin(observables).subscribe((pickListDetails) => {
        const countMap = new Map<any, any>(); // Map to store productId and its count
        const productMap = new Map<any, any>();
        const unitMap = new Map<any, any>();
        for (let i = 0; i < pickListDetails.length; i++) {
          for (let j = 0; j < pickListDetails[i].length; j++) {
            this.productList.push(pickListDetails[i][j]);

            const productId = pickListDetails[i][j].product.id;
            const productCount = pickListDetails[i][j].quantity;
            const productName = pickListDetails[i][j].product.productName;
            const unitId = pickListDetails[i][j].secondaryUnit.id;
            const unit = pickListDetails[i][j].secondaryUnit.secondaryUnitName;

            const isSameProduct = this.productList.some((existingProduct) => {
              return (
                existingProduct.product.id === productId
                && existingProduct.product.unitId === unitId
              );
            });

            if (!isSameProduct) {
              this.productList.push(pickListDetails[i][j]);
              console.log(this.productList);

              if (countMap.has(productId)) {
                countMap.set(productId, countMap.get(productId) + productCount);
              } else {
                countMap.set(productId, productCount);
              }
              console.log(countMap);

              if (!productMap.has(productId)) {
                productMap.set(productId, productName);
                productMap.set(unitId, unit);
              }
              console.log(productMap);
            }
          }
        }
        for (const [productId, count] of countMap) {
          const productName = productMap.get(productId);
          this.combinedArray.push({ productId, productName, count });
        }
      });
      console.log(this.combinedArray);

    })
  }

  saveAndDownload(){

  }



}
