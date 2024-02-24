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
import { SalesService } from '../../../sales.service';
import { ActivatedRoute } from '@angular/router';
import { RouteDetails } from '../../models/route-details';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from 'src/app/modules/products/product.service';

@Component({
  selector: 'app-route-entry',
  templateUrl: './route-entry.component.html',
  styleUrls: ['./route-entry.component.scss']
})
export class RouteEntryComponent implements OnInit, OnDestroy {

  constructor(private fb: FormBuilder, private dialog: MatDialog, private productservice: ProductService,
    private salesService: SalesService, private purchaseService: PurchaseService, private route: ActivatedRoute,
    private _snackBar: MatSnackBar) {}

  ngOnDestroy(): void {
    this.detailsub?.unsubscribe();
    this.unitSub?.unsubscribe();
    this.edit?.unsubscribe();
    this.submit?.unsubscribe();
    this.gstSub?.unsubscribe();
    this.hsnSub?.unsubscribe();
    this.orderSub?.unsubscribe();
    this.edit?.unsubscribe();
  }

  orderId!: number;
  entryId!: number;
  userId!: number;
  ngOnInit(): void {
    this.orderId = this.route.snapshot.params['id'];
    this.entryId = this.route.snapshot.params['editid'];

    const token: any = localStorage.getItem('token')
    let user = JSON.parse(token)
    console.log(user);
    this.userId = user.id

    if(this.orderId){
      this.getRO();
    }else if(this.entryId){
      this.patchData()
    }
    this.getAllRouteProducts();
    this.getSecondaryUnit();
    this.getGST();
    this.getHsn();
    this.generateInvoiceNumber();
  }


  purchaseAmount: number = 0;
  onAmountChange(){
    let details = this.routeSEDetails().length;
    for(let i = 0; i < details; i++) {
      let grossAmount = this.routeSEDetails().at(i).get("amount")?.value;
      if (grossAmount) {
        this.purchaseAmount = grossAmount + this.purchaseAmount;
        // this.routeEntryForm.get("totalAmount")?.setValue(this.purchaseAmount);
      }
    }

      // }
    // }
  }

  routeEntryForm = this.fb.group({
    invoiceNo : ['', Validators.required],
    amount : [''],
    paymentMode : [''],
    routeSEDetails : this.fb.array([]),
    invoiceDate : [''],
    routeSOId : [0],
    userId : [0],
    creditBalance : [0],
    totalAmount : [0]
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

  addDetails(value?: any){
    this.routeSEDetails().push(this.newProduct(value));
  }

  removeDetails(i: number){
    this.routeSEDetails().removeAt(i);
  }

  orderSub!: Subscription;
  getRO(){
    this.orderSub = this.salesService.getRouteOrderById(this.orderId).subscribe(r =>{
      this.getLedger(r.customer.id)
      let details = r.routeSODetails;
      for(let i = 0; i < details.length; i++){
        console.log(details[i]);

        this.addDetails(details[i])
        let gst = details[i].product.gst?.gstName;
        let hsn = details[i].product.hsn?.hsnName;
        this.routeSEDetails().at(i).get("gst")?.setValue(gst);
        this.routeSEDetails().at(i).get("hsn")?.setValue(hsn);
      }
    });
  }

  getDetails(i: number, id:number){
    this.productservice.getProductById(id).subscribe(details=>{
      let gst = details.gst?.gstName;
      let hsn = details.hsn?.hsnName;
      this.routeSEDetails().at(i).get("gst")?.setValue(gst);
      this.routeSEDetails().at(i).get("hsn")?.setValue(hsn);
    })
  }

  ledgerSub!: Subscription;
  getLedger(id: number){
    this.ledgerSub = this.salesService.getLedgerByCustomer(id).subscribe(ledger=>{
      console.log(ledger);
      let amount = 0;
      for(let i=0; i<ledger.length; i++){
        console.log(amount);

        if(ledger[i].credit){
          amount = ledger[i].credit + amount;
          console.log(amount);

        }else{
          amount = ledger[i].debit - amount;
          console.log(amount);

        }
      }
      console.log(amount);

      this.routeEntryForm.get("creditBalance")?.setValue(amount)
    })
  }

  calculateLineAmount(){

  }

  ivNum: string = "";
  nextId!: any;
  prefix!: string;
  prSub!: Subscription;
  generateInvoiceNumber() {
    this.prSub = this.salesService.getRouteEntry().subscribe((res) => {
      let entry = res;

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

  detailsub!: Subscription;
  product: Product[] = [];
  getAllRouteProducts(value?:any){
    this.productservice.getAllRouteProducts().subscribe((details) =>{
      this.product = details
      this.filteredProduct = details
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
      this.getAllRouteProducts()
      console.log(result.product.id);

      this.routeSEDetails().at(i).get('productId')?.setValue(result.product.id);
    });

  }

  unitSub!: Subscription;
  units: SecondaryUnit[] = [];
  getSecondaryUnit(value?: string){
    this.unitSub = this.productservice.getSecondaryUnit().subscribe(data => {
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
    this.hsnSub = this.productservice.getHsn().subscribe(data => {
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
    this.unitSub = this.productservice.getGst().subscribe(data => {
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
    if(!this.routeEntryForm.valid){
      return alert("Please fill the form completely")
    }
    let data = {
      ...this.routeEntryForm.value
    }
    data.routeSOId = this.orderId
    data.userId = this.userId
    console.log(data);

    this.salesService.addRouteEntry(data).subscribe(res=>{
      console.log(res);
      history.back();
      // if(!this.dialogRef){
      //   history.back();
      // }
      this._snackBar.open("RouteEntry added successfully...","" ,{duration:3000})
      this.clearControls()
    });
  }

  clearControls(){
    this.routeEntryForm.reset()
  }

  isEdit: boolean = false;
  seId!: number;
  patchData(){
    this.isEdit = true;
    this.salesService.getRouteEntryById(this.entryId).subscribe(data =>{
      let list = data
      console.log(list);

      this.seId = list.id;
      let invoiceNo = list.invoiceNo
      let date: any = list.invoiceDate;
      let balance: any = list.creditBalance;

      this.routeEntryForm.patchValue({
        invoiceNo: invoiceNo,
        invoiceDate: date,
        creditBalance: balance
      })

      const pl = this.routeEntryForm.get("routeSEDetails") as FormArray;
        pl.clear();
        let details = list.routeSEDetails;
        console.log(details);

        if (details && details.length > 0) {
          details.forEach((detail: any) => {
            console.log(detail);

          const details = this.fb.group({
            productId : detail.productId,
            quantity : detail.quantity,
            secondaryUnitId : detail.secondaryUnitId,
            mrp: detail.mrp,
            hsnCode: detail.hsnCode,
            gst: detail.gst,
            rate: detail.rate,
            amount: detail.amount
          });

          pl.push(details);
        })
      }
    });
  }

  edit!: Subscription;
  editFunction(){
    this.isEdit = false;
    let data = {
      ...this.routeEntryForm.value
    }
    data.routeSOId = this.orderId
    data.userId = this.userId
    console.log(data);

    this.edit = this.salesService.updateRouteEntry(this.seId, data).subscribe(res=>{
      console.log(res);
      history.back();
      this._snackBar.open("RouteEntry updated successfully...","" ,{duration:3000})
      this.clearControls()
    })
  }
}
