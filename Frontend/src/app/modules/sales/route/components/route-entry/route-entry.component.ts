import { PurchaseService } from './../../../../purchase/purchase.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { GstComponent } from 'src/app/modules/products/components/gst/gst.component';
import { HsnComponent } from 'src/app/modules/products/components/hsn/hsn.component';
import { ProductComponent } from 'src/app/modules/products/components/product/product.component';
import { UnitComponent } from 'src/app/modules/products/components/unit/unit.component';
import { Gst } from 'src/app/modules/products/models/gst';
import { Hsn } from 'src/app/modules/products/models/hsn';
import { Product } from 'src/app/modules/products/models/product';
import { SecondaryUnit } from 'src/app/modules/products/models/secondary-unit';
import { ProductService } from 'src/app/modules/products/product.service';
import { SalesService } from '../../../sales.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-route-entry',
  templateUrl: './route-entry.component.html',
  styleUrls: ['./route-entry.component.scss']
})
export class RouteEntryComponent implements OnInit, OnDestroy {

  constructor(private fb: FormBuilder, private dialog: MatDialog, private productService: ProductService,
    private salesService: SalesService, private purchaseService: PurchaseService, private route: ActivatedRoute) {}

  ngOnDestroy(): void {
    this.productSub?.unsubscribe();
    this.unitSub?.unsubscribe();
    this.edit?.unsubscribe();
    this.submit?.unsubscribe();
    this.gstSub?.unsubscribe();
    this.hsnSub?.unsubscribe();
    this.orderSub?.unsubscribe();
  }

  orderId!: number;
  userId!: number;
  ngOnInit(): void {
    this.orderId = this.route.snapshot.params['id']

    const token: any = localStorage.getItem('token')
    let user = JSON.parse(token)
    console.log(user);
    this.userId = user.id

    this.getProduct();
    this.getSecondaryUnit();
    this.getGST();
    this.getHsn();
    this.addDetails();
    this.generateInvoiceNumber();
    this.getRO();
  }

  routeEntryForm = this.fb.group({
    invoiceNo : ['', Validators.required],
    amount : [''],
    paymentMode : ['', Validators.required],
    routeSEDetails : this.fb.array([]),
    invoiceDate : [''],
    routeSOId : [0],
    userId : [0]
  });

  pModes = [
    {value: 'Cash'},
    {value: 'BankTransfer'},
    {value: 'GooglePay'},
  ]

  routeSEDetails(): FormArray{
    return this.routeEntryForm.get("routeSEDetails") as FormArray;
  }

  newProduct(initialValue?: any): FormGroup {
    return this.fb.group({
      productId: [
        initialValue ? initialValue.productId : "",
        Validators.required,
      ],
      quantity: [
        initialValue ? initialValue.quantity : null,
        Validators.required,
      ],
      secondaryUnitId: [
        initialValue ? initialValue.secondaryUnitId : null,
        Validators.required,
      ],
      mrp: [
        initialValue ? initialValue.mrp : null,
        Validators.required,
      ],
      hsnCode: [
        initialValue ? initialValue.hsnCode : null
      ],
      gst: [
        initialValue ? initialValue.gst : null
      ],
      rate: [
        initialValue ? initialValue.rate : null,
        Validators.required,
      ],
      amount: [
        initialValue ? initialValue.amount : null,
        Validators.required,
      ]
    });
  }

  addDetails(){
    this.routeSEDetails().push(this.newProduct());
  }

  removeDetails(i: number){
    this.routeSEDetails().removeAt(i);
  }

  orderSub!: Subscription;
  getRO(){
    this.orderSub = this.salesService.getRouteOrderById(this.orderId).subscribe(r =>{
      console.log(r);
    });
  }

  ivNum: string = "";
  nextId!: any;
  prefix!: string;
  prSub!: Subscription;
  generateInvoiceNumber() {
    this.prSub = this.salesService.getRouteEntry().subscribe((res) => {
      let entry = res;
      console.log(entry);

      // Check if there are any employees in the array
      if ( entry.length > 0) {
        const maxId =  entry.reduce((prevMax, inv) => {
          // Extract the numeric part of the employee ID and convert it to a number
          const idNumber = parseInt(inv.invoiceNo.substring(5), 10);

          this.prefix = this.extractLetters(inv.invoiceNo);

          // Check if the extracted numeric part is a valid number
          if (!isNaN(idNumber)) {
            return idNumber > prevMax ? idNumber : prevMax;
          } else {
            // If the extracted part is not a valid number, return the previous max
            return prevMax;
          }
        }, 0);
        // Increment the maxId by 1 to get the next ID
        this.nextId = maxId + 1;
      } else {
        // If there are no employees in the array, set the employeeId to 'EMP001'
        this.nextId = 0o0;
        this.prefix = "INVRSE";
      }

      const paddedId = `${this.prefix}${this.nextId
        .toString()
        .padStart(3, "0")}`;

      this.ivNum = paddedId;

      this.routeEntryForm.get("invoiceNo")?.setValue(this.ivNum);
    });
  }

  extractLetters(input: string): string {
    return input.replace(/[^a-zA-Z]/g, "");
  }

  productSub!: Subscription;
  product: Product[] = [];
  getProduct(value?:any){
    this.productService.getProduct().subscribe((products) =>{
      this.product = products
      this.filteredProduct = products
      if(value){
        this.filterProduct(value)
      }
    })
  }

  myControl = new FormControl<string | Product>("");
  filteredProduct: Product[] = [];
  filterProduct(event: Event) {

    let value = (event.target as HTMLInputElement).value;
    this.filteredProduct = this.product.filter((option) => {
      if (
        (option.productName &&
          option.productName.toLowerCase().includes(value?.toLowerCase())) ||
        (option.code &&
          option.code.toLowerCase().includes(value?.toLowerCase())) ||
        (option.barCode &&
          option.barCode.toLowerCase().includes(value?.toLowerCase()))
      ) {
        return true;
      } else {
        return null;
      }
    });
  }

  addNewProduct(i: number){
    const dialogRef = this.dialog.open(ProductComponent, {
      data: { status: "true"},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getProduct()
      console.log(result.product.id);

      this.routeSEDetails().at(i).get('productId')?.setValue(result.product.id);
    });

  }

  unitSub!: Subscription;
  units: SecondaryUnit[] = [];
  getSecondaryUnit(value?: string){
    this.unitSub = this.productService.getSecondaryUnit().subscribe(data => {
      this.units = data;
      this.filteredSecondaryUnit = this.units;
      if(value){
        this.filterSecondaryUnit(value);
      }
    })
  }

  filteredSecondaryUnit: SecondaryUnit[] = [];
  filterSecondaryUnit(event: Event | string) {
    let value: string = "";

    if (typeof event === "string") {
      value = event;
    } else if (event instanceof Event) {
      value = (event.target as HTMLInputElement).value;
    }
    this.filteredSecondaryUnit = this.units.filter((option) => {
      if (
        (option.secondaryUnitName &&
          option.secondaryUnitName.toLowerCase().includes(value?.toLowerCase()))
      ) {
        return true;
      } else {
        return null;
      }
    });
  }

  addSecondaryUnit(i : number){
    const dialogRef = this.dialog.open(UnitComponent, {
      data: { status: "add", unit: "secondary"},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getSecondaryUnit()
      console.log((result.unit.id));

      this.routeSEDetails().at(i).get('secondaryUnitId')?.setValue(result.unit.id);
    });
  }

  hsnSub!: Subscription;
  hsn: Hsn[] = [];
  getHsn(value?: string){
    this.hsnSub = this.productService.getHsn().subscribe(data => {
      this.hsn = data;
      this.filteredHsn = this.hsn;
      if(value){
        this.filterHsn(value);
      }
    })
  }

  filteredHsn: Hsn[] = [];
  filterHsn(event: Event | string) {
    let value: string = "";

    if (typeof event === "string") {
      value = event;
    } else if (event instanceof Event) {
      value = (event.target as HTMLInputElement).value;
    }
    this.filteredSecondaryUnit = this.units.filter((option) => {
      if (
        (option.secondaryUnitName &&
          option.secondaryUnitName.toLowerCase().includes(value?.toLowerCase()))
      ) {
        return true;
      } else {
        return null;
      }
    });
  }

  addHsn(i : number){
    const dialogRef = this.dialog.open(HsnComponent, {
      data: { status: "add"},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getHsn()
      console.log((result.hsn.hsnName));

      this.routeSEDetails().at(i).get('hsn')?.setValue(result.hsn.hsnName);
    });
  }

  gstSub!: Subscription;
  gst: Gst[] = [];
  getGST(value?: string){
    this.unitSub = this.productService.getGst().subscribe(data => {
      this.gst = data;
      this.filteredGst = this.gst;
      if(value){
        this.filterGst(value);
      }
    })
  }

  filteredGst: Gst[] = [];
  filterGst(event: Event | string) {
    let value: string = "";

    if (typeof event === "string") {
      value = event;
    } else if (event instanceof Event) {
      value = (event.target as HTMLInputElement).value;
    }
    this.filteredGst = this.gst.filter((option) => {
      if (
        (option.gstName &&
          option.gstName.toLowerCase().includes(value?.toLowerCase()))
      ) {
        return true;
      } else {
        return null;
      }
    });
  }

  addGst(i : number){
    const dialogRef = this.dialog.open(GstComponent, {
      data: { status: "add"},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getSecondaryUnit()
      console.log((result.gst.id));

      this.routeSEDetails().at(i).get('gst')?.setValue(result.gst.id);
    });
  }

  submit!: Subscription;
  onSubmit(){
    let data = {
      ...this.routeEntryForm.value
    }
    data.routeSOId = this.orderId
    data.userId = this.userId
    this.salesService.addRouteEntry(data).subscribe(res=>{
      console.log(res);
    });
  }

  isEdit: boolean = false;
  edit!: Subscription;
  editFunction(){

  }
}
