import { Component, Inject, OnDestroy, OnInit, Optional, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SalesService } from '../../../sales.service';
import { Subscription, forkJoin } from 'rxjs';
import { Route } from '../../models/route';
import { RouteComponent } from '../route/route.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Customer } from '../../../customers/models/customer';
import { CustomerComponent } from '../../../customers/components/customer/customer.component';
import { TripDaysComponent } from '../trip-days/trip-days.component';
import { TripDays } from '../../models/trip-days';
import { Product } from 'src/app/modules/products/models/product';
import { ProductService } from 'src/app/modules/products/product.service';
import { ProductComponent } from 'src/app/modules/products/components/product/product.component';
import { SecondaryUnit } from 'src/app/modules/products/models/secondary-unit';
import { UsersService } from 'src/app/modules/users/users.service';
import { UnitComponent } from 'src/app/modules/products/components/unit/unit.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { GridComponent, PdfExportProperties } from '@syncfusion/ej2-angular-grids';
import { Trip } from '../../models/trip';

@Component({
  selector: 'app-pick-list',
  templateUrl: './pick-list.component.html',
  styleUrls: ['./pick-list.component.scss']
})
export class PickListComponent implements OnInit, OnDestroy {

  @ViewChild("grid") grid!: GridComponent;
  public pdfExportProperties: PdfExportProperties | undefined;
  public toolbar: string[] | undefined;

  constructor(
    private route: ActivatedRoute, private salesService: SalesService,private router: Router, private http: HttpClient) {}

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
    this.getRoute();
    this.getTrip();
  }

  isHovered = false;
  hoveredButton: string | null = null;
  showName(buttonName: string, i?: number){
    this.isHovered = true;
    this.hoveredButton = buttonName;
  }

  hideName() {
    this.isHovered = false;
    this.hoveredButton = null;
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

  tripSub!: Subscription;
  trip!: Trip;
  getTrip(){
    this.tripSub = this.salesService.getTripById(this.tripId).subscribe(res=>{
      console.log(res);
      this.trip = res;
    })
  }

  combinedArray: any[] = [];
  productList : any[] = [];
  routeSub!: Subscription;
  getRoute(){
    this.routeSub = this.salesService.getRouteOrderByRouteId(this.routeId).subscribe(x=>{
      console.log(x);

      this.combinedArray = x.filter(x=>x.status.toLowerCase() === 'invoiceissued')
      const observables = this.combinedArray.map((pick) => {
        return this.salesService.getRouteOrderDetails(pick.id);
      });

      forkJoin(observables).subscribe((pickListDetails) => {
        const countMap = new Map<any, any>(); // Map to store productId and its count
        const productMap = new Map<any, any>();
        for (let i = 0; i < pickListDetails.length; i++) {
          for (let j = 0; j < pickListDetails[i].length; j++) {

            const productId = pickListDetails[i][j].product.id;
            const productCount = pickListDetails[i][j].quantity;
            const productName = pickListDetails[i][j].product.productName;

            const isSameProduct = this.productList.some((existingProduct) => {
              return (
                existingProduct.product.id === productId
              );
            });

            if (!isSameProduct) {
              this.productList.push(pickListDetails[i][j]);

              if (countMap.has(productId)) {
                countMap.set(productId, countMap.get(productId) + productCount);
              } else {
                countMap.set(productId, productCount);
              }

              if (!productMap.has(productId)) {
                productMap.set(productId, productName);
              }
            }
          }
        }
        for (const [productId, count] of countMap) {
          const productName = productMap.get(productId);
          this.combinedArray.push({ productId, productName, count });
        }
      });

    })
  }

  saveAndDownload(){

  }

  viewDetails(){
    this.router.navigateByUrl('/login/sales/routesale/viewtrip/details/picklistdetails/'+ this.routeId)
  }

}
