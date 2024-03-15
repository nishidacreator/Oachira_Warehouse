import { ProductComponent } from './../../../products/components/product/product.component';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PurchaseService } from '../../purchase.service';
import { ActivatedRoute } from '@angular/router';
import { Entry } from '../../models/entry';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Distributor } from 'src/app/modules/products/models/distributor';
import { Subscription } from 'rxjs';
import { ProductService } from 'src/app/modules/products/product.service';
import { MatDialog } from '@angular/material/dialog';
import { DistributorComponent } from 'src/app/modules/products/components/distributor/distributor.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
import { GstComponent } from 'src/app/modules/products/components/gst/gst.component';
import { UnitComponent } from 'src/app/modules/products/components/unit/unit.component';
import { Gst } from 'src/app/modules/products/models/gst';
import { Product } from 'src/app/modules/products/models/product';
import { SecondaryUnit } from 'src/app/modules/products/models/secondary-unit';

@Component({
  selector: 'app-edit-pe',
  templateUrl: './edit-pe.component.html',
  styleUrls: ['./edit-pe.component.scss']
})
export class EditPeComponent implements OnInit, OnDestroy {
  @ViewChild(MatStepper) stepper!: MatStepper;
  constructor(private purchaseService: PurchaseService, private route: ActivatedRoute, private fb: FormBuilder, private productService: ProductService,
    private dialog: MatDialog, private _snackBar: MatSnackBar, private productservice: ProductService) { }

  ngOnDestroy(): void {
    this.updateSub?.unsubscribe();
    this.distributorSub?.unsubscribe();
    this.peSub?.unsubscribe();
  }

  ngOnInit(): void {
    this.getDistributor();
  }

  selectedIndex = 0;
  entryStatus = false;
  addStatus = false;
  purchaseEntryForm = this.fb.group({
    distributorId: [0],
    purchaseAmount:[0],
    status: [],
    purchaseInvoiceNo: [''],
    amount: [0],
    chequeNo: [''],
    purchaseDate:[''],
    chequeClearenceDate:[''],
    advanceAmount:[0],
    invoiceDate:['']
  })

  entry!: Entry;
  peSub!: Subscription;
  getPe(){
    this.purchaseService.getPeById(this.route.snapshot.params['id']).subscribe(data => {
      this.entry = data;
      console.log(this.entry);

      let distributorId: any = this.entry.distributorId;
      let amount = this.entry.purchaseAmount;
      let status: any = this.entry.status;
      let invoice = this.entry.purchaseInvoiceNo;
      let invoiceDate:any = this.entry.invoiceDate;
      let purchaseDate:any = this.entry.purchaseDate;
      let chequeNo = this.entry.entryCheques.find(c => c.type === 'purchase')?.chequeNo;

      let chequeAmount = this.entry.entryCheques.find(c => c.type === 'purchase')?.amount;

      let chequeDate: any = this.entry.entryCheques.find(c => c.type === 'purchase')?.chequeClearenceDate;

      this.purchaseEntryForm.patchValue({
        distributorId: distributorId,
        purchaseAmount: amount,
        status: status,
        invoiceDate: invoiceDate,
        purchaseInvoiceNo: invoice,
        chequeNo: chequeNo,
        amount: chequeAmount,
        chequeClearenceDate: chequeDate,
        purchaseDate: purchaseDate
      })
    })
  }

  nextStatus: boolean = false;
  updateSub!: Subscription;
  updatePe(){
      let data = {
        ...this.purchaseEntryForm.value
      }
      console.log(data);

      this.updateSub = this.purchaseService.updatePurchaseEntry(this.route.snapshot.params['id'], data).subscribe(res=>{
        this._snackBar.open("Entry updated successfully...","" ,{duration:3000})
        console.log(res);
        this.nextStatus = true;
      });
  }

  navigateToNextStep(type: string) {
    this.nextStatus = false;
    if(type === 'entrydetails'){
      this.getPeDetails();
      this.getProduct();
      this.getUnit();
      this.getGST();
    }else if(type === 'entry'){
      this.getPeNext();
    }
    this.stepper.next();
  }

  distributorSub!: Subscription;
  distributors: Distributor[] = [];
  filteredDistributor: Distributor[] = [];
  getDistributor(value?: number){
    this.distributorSub = this.productService.getDistributor().subscribe(distributor =>{
      this.distributors = distributor
      this.filteredDistributor = distributor;
      console.log(distributor);

      this.getPe();
      if(value){
        // this.purchaseEntryForm.get('distributorId')?.setValue(value)
      }
    });
  }

  filterDistributor(event: any){
    let value: string = "";

    if (typeof event === "string") {
      value = event;
    } else if (event instanceof Event) {
      value = (event.target as HTMLInputElement).value;
    }
    this.filteredDistributor = this.distributors.filter((option) => {
      if (
        (option.distributorName &&
          option.distributorName.toLowerCase().includes(value?.toLowerCase()))
      ) {
        return true;
      } else {
        return null;
      }
    });
  }

  addDistributor(){
    const dialogRef = this.dialog.open(DistributorComponent, {
      data: { status: "true", type: "add"},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getDistributor(result?.distributor.id);
    });
  }

  isHovered = false;
  hoveredButton: string | null = null;
  showName(buttonName: string){
    this.isHovered = true;
    this.hoveredButton = buttonName;
  }

  hideName() {
    this.isHovered = false;
    this.hoveredButton = null;
  }

  finalForm = this.fb.group({
    eWayBillNo: [''],
    trans:[false],
    transportation: [0],
    unload: [false],
    unloading:[0],
    com: [false],
    commission:[0],
    paymentMode:[''],
    remarks:['']
  });

  modes = [
    {value :"Gpay"},
    {value :"Credit"},
    {value : "Cash"},
    {value : "Cheque"}
  ];

  com: boolean = true;
  unload: boolean = true;
  trans: boolean = true;
  getPeNext(){
      let eWayBillNo = this.entry.eWayBillNo;
      let transportation = this.entry.transportation;
      let unloading = this.entry.unloading;
      let commission = this.entry.commission;
      let paymentMode = this.entry.paymentMode;
      let remarks = this.entry.remarks;
      if(commission === 0){
        this.com = false
      }if(unloading === 0){
        this.unload = false
      }if(transportation === 0){
        this.trans = false
      }

      this.finalForm.patchValue({
        eWayBillNo: eWayBillNo,
        transportation: transportation,
        unloading: unloading,
        commission: commission,
        paymentMode: paymentMode,
        remarks: remarks,
        com: this.com,
        trans: this.trans,
        unload: this.unload
      })
  }


  finalStatus: boolean = false;
  updatePE(){
    if(!this.finalForm.valid){
      return alert("Please enter details completely!");
    }
    this.finalStatus = true;
    let data = {
      invoiceDate: this.finalForm.get('invoiceDate')?.value,
      transportation: this.finalForm.get('transportation')?.value,
      unloading: this.finalForm.get('unloading')?.value,
      commission: this.finalForm.get('commission')?.value,
      paymentMode: this.finalForm.get('paymentMode')?.value,
      eWayBillNo: this.finalForm.get('eWayBillNo')?.value,
      remarks : this.finalForm.get('remarks')?.value,
    }
    this.purchaseService.updatePE(this.route.snapshot.params['id'], data).subscribe(data => {
      this._snackBar.open("Entry updated successfully...","" ,{duration:3000})
      this.nextStatus = true;
    })
  }

  entryDetailsForm = this.fb.group({
    products: this.fb.array([])
  });

  products() : FormArray {
    return this.entryDetailsForm.get("products") as FormArray
  }

  newProduct(initialValue?: any): FormGroup {
    return this.fb.group({
      entryId: [initialValue ? initialValue.entryId : this.route.snapshot.params['id']],
      productId : [initialValue ? initialValue.productId : "", Validators.required],
      quantity :  [initialValue ? initialValue.quantity : "", Validators.required],
      secondaryUnitId :  [initialValue ? initialValue.secondaryUnitId : "", Validators.required],
      mrp: [initialValue ? initialValue.mrp : "", Validators.required],
      rate: [initialValue ? initialValue.rate : "", Validators.required],
      discount :  [initialValue ? initialValue.discount : ""],
      gstId :  [initialValue ? initialValue.gstId : ""],
      grossAmount:  [initialValue ? initialValue.grossAmount : "", Validators.required],
      netAmount :   [initialValue ? initialValue.netAmount : "", Validators.required],
      taxableAmount : [initialValue ? initialValue.taxableAmount : "", Validators.required]
    })
  }

  addProduct() {
    this.products().push(this.newProduct());
  }

  removeProduct(i:number) {
    this.products().removeAt(i);
  }

  value!: boolean
  getPeDetails(){
    const pd = this.entryDetailsForm.get("products") as FormArray;
        pd.clear();
        let eDetails = this.entry.entryDetails;
        console.log(this.entry);

        if (eDetails && eDetails.length > 0) {
          this.value = true;
          eDetails.forEach((detail: any) => {
            console.log(detail);

            const details = this.fb.group({
              entryId : detail.entryId,
              productId : detail.productId,
              quantity : detail.quantity,
              secondaryUnitId : detail.secondaryUnitId,
              mrp: detail.mrp,
              rate: detail.rate,
              discount: detail.discount,
              gstId: detail.gstId,
              grossAmount: detail.grossAmount,
              netAmount: detail.netAmount,
              taxableAmount: detail.taxableAmount
            });

            pd.push(details);
          })
        }else{
          this.value = false;
          this.addProduct();
        }
  }

  detailsSub!: Subscription;
  saveDetails(){
    this.purchaseService.addPEDetails(this.entryDetailsForm.getRawValue()).subscribe(data => {
      this._snackBar.open("Entry Details Added successfully...","" ,{duration:3000})
      history.back();
    })
  }

  updateDetails(){
    console.log(this.entryDetailsForm.getRawValue());

    this.purchaseService.updatePEDetails(this.entryDetailsForm.getRawValue(), this.route.snapshot.params['id']).subscribe(data => {
      console.log(data);

      this._snackBar.open("Entry Details updated successfully...","" ,{duration:3000})
      history.back();
    })
  }

  product: Product[] = [];
  productSub!: Subscription;
  getProduct(value?: string){
    this.productSub = this.productService.getProduct().subscribe(res=>{
      this.product = res;
      this.filteredProduct = res;
    })
  }

  addProducts(){
    const dialogRef = this.dialog.open(ProductComponent, {
      data: { status: "true"},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getProduct(result?.route);
    });
  }

  filteredProduct: Product[] = [];
  filterProduct(event: Event | string) {
    let value: string = "";

    if (typeof event === "string") {
      value = event;
    } else if (event instanceof Event) {
      value = (event.target as HTMLInputElement).value;
    }
    this.filteredProduct = this.product.filter((option) => {
      if (
        (option.productName &&
          option.productName.toLowerCase().includes(value?.toLowerCase()))
      ) {
        return true;
      } else {
        return null;
      }
    });
  }

  units: SecondaryUnit[] = [];
  unitSub!: Subscription;
  getUnit(value?:string){
    this.unitSub = this.productService.getSecondaryUnit().subscribe(unit=>{
      this.units = unit;
      this.filteredUnit = unit;
      if(value){
        this.filterUnit(value);
      }
    });
  }

  addUnit(){
    const dialogRef = this.dialog.open(UnitComponent, {
      data: { status: "add", type : "add", unit: "secondary" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getUnit(result?.unit);
    });
  }

  filteredUnit: SecondaryUnit[] = [];
  filterUnit(event: Event | string) {
    let value: string = "";

    if (typeof event === "string") {
      value = event;
    } else if (event instanceof Event) {
      value = (event.target as HTMLInputElement).value;
    }
    this.filteredUnit = this.units.filter((option) => {
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
      this.getGST()
      console.log((result.gst.id));

      this.products().at(i).get('gstId')?.setValue(result.gst.id);
    });
  }



}
