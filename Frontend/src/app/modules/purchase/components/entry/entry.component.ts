import { Component, Inject, OnDestroy, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ProductService } from 'src/app/modules/products/product.service';
import { PurchaseService } from '../../purchase.service';
import { Distributor } from 'src/app/modules/products/models/distributor';
import { DistributorComponent } from 'src/app/modules/products/components/distributor/distributor.component';
import { MatStepper } from '@angular/material/stepper';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss']
})
export class EntryComponent implements OnInit, OnDestroy {
  @ViewChild(MatStepper) stepper!: MatStepper;

  id!: number;
  isChecked: boolean = false;
  constructor(private fb: FormBuilder, public purchaseService: PurchaseService, public dialog: MatDialog,
    private productService: ProductService, private _snackBar: MatSnackBar, private router: Router,
    @Optional() public dialogRef: MatDialogRef<EntryComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any) {
    //User
    const token: any = localStorage.getItem("token");
    let user = JSON.parse(token);
    this.id = user.id;
  }

  ngOnDestroy() {
    this.distributorSub?.unsubscribe();
    this.submitSub?.unsubscribe();
    this.slipSub?.unsubscribe();
  }

  addStatus: boolean = false;
  ngOnInit(): void {
    this.getDistributor()
    this.addProduct();
    if (this.dialogRef) {
      this.addStatus = false;

      this.patchData(this.dialogData.id)
    }
  }

  patchData(id: number){
    this.purchaseService.getPeById(id).subscribe(data =>{
      console.log(data);
      let distributorId = data.distributorId;
      let date: any = data.purachseDate;
      let purchaseInvoice = data.purchaseInvoice;
      let amount = data.purchaseAmount;

      this.purchaseEntryForm.patchValue({
        distributorId: distributorId,
        purachseDate: date,
        purchaseInvoice: purchaseInvoice,
        purchaseAmount: amount,
        status: "ChequeIssued"
      })
    });
  }

  updateStatus(){
    let data = {
      chequeNo: this.purchaseEntryForm.get('chequeNo')?.value,
      status: this.purchaseEntryForm.get('status')?.value
    }
    this.purchaseService.updatePEStatus(this.dialogData.id, data).subscribe(data =>{
      this._snackBar.open("Entry status update successfully...","" ,{duration:3000})
      this.dialogRef?.close()
    });
  }

  purchaseEntryForm = this.fb.group({
    distributorId: [0, Validators.required],
    purchaseInvoice: ['', Validators.required],
    purchaseAmount: [0, Validators.required],
    purachseDate: [''],
    status: [''],
    chequeNo: [''],
    entryDetails: this.fb.array([]),
    userId: [0]
  });

  slipForm = this.fb.group({
    purchaseInvoice: ['', Validators.required],
    distributorId: [0],
    invoiceNo:['', Validators.required],
    amount: [''],
    entryId: [0],
    description: [''],
    date: [''],
    contactPerson: ['']
  });

  finalForm = this.fb.group({
    eWayBillNo: [''],
    trans:[''],
    transportation: [''],
    unload: [''],
    unloading:[''],
    com: [''],
    commission:[''],
    paymentMode:[''],
    invoiceDate:[''],
    remarks:['']
  });

  modes = [
    { value: "Cheque" },
    { value: "Cash" }
  ];

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

  products(): FormArray {
    return this.purchaseEntryForm.get("entryDetails") as FormArray;
  }

  newProduct(): FormGroup {
    return this.fb.group({
      purchaseEntryId: [ , ],
      productId : [],
      quantity :  [],
      unitId : [],
      mrp: [],
      rate: [],
      gross: [],
      discount : [],
      sgst :  [],
      cgst :  [],
      net :  [],
      rent : [],
      commision :  [],
      profit : [],
      salePrice : [],

    });
  }

  addProduct(){
    this.products().push(this.newProduct());
  }

  removeProduct(i: number){
    this.products().removeAt(i);
  }

  distributorSub!: Subscription;
  distributors: Distributor[] = [];
  getDistributor(value?: number){
    this.distributorSub = this.productService.getDistributor().subscribe(distributor =>{
      this.distributors = distributor
      this.filteredDistributor = distributor;
      if(value){
        this.purchaseEntryForm.get('distributorId')?.setValue(value)
      }
    });
  }

  filteredDistributor: Distributor[] = [];
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

  submitSub!: Subscription;
  selectedIndex = 0;
  onSubmit(type: string){
    if(this.purchaseEntryForm.valid){
      this.addStatus = true;
      let data = {
        ...this.purchaseEntryForm.value
      }
      data.userId = this.id
      this.submitSub = this.purchaseService.addPE(data).subscribe(data=>{
        console.log(data);

        this._snackBar.open("Entry added successfully...","" ,{duration:3000})
        if(type === "close"){
          history.back();
        }else if(type === "slip"){
          this.stepper.next();
          this.patchSlip(data)
        }else if(type === "next"){
          this.stepper.selectedIndex = 2;
          this.patchSlip(data);
        }
      });
    }
  }

  peId!: number;
  patchSlip(data:any){
    this.peId = data.id;
    let distributorId = data.distributorId;
    let date = data.purachseDate;
    let purchaseInvoice = data.purchaseInvoice;
    let amount = data.purchaseAmount;
    this.generateInvoiceNumber()
    this.slipForm.patchValue({
      distributorId: distributorId,
      date: date,
      purchaseInvoice: purchaseInvoice,
      amount: amount
    })
  }

  ivNum: string = "";
  nextId!: any;
  prefix!: string;
  prSub!: Subscription;
  generateInvoiceNumber() {
    this.prSub = this.purchaseService.getSlip().subscribe((res) => {
      let purchases = res;

      // Check if there are any employees in the array
      if (purchases.length > 0) {
        const maxId = purchases.reduce((prevMax, inv) => {
          console.log(inv);
          // Extract the numeric part of the employee ID and convert it to a number
          const idNumber = parseInt(inv.invoiceNo.substring(5), 10);
          console.log(idNumber);

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
        console.log(this.nextId);
      } else {
        // If there are no employees in the array, set the employeeId to 'EMP001'
        this.nextId = 0o0;
        this.prefix = "INV-PRS-000";
      }

      const paddedId = `${this.prefix}${this.nextId
        .toString()
        .padStart(3, "0")}`;

      this.ivNum = paddedId;

      this.slipForm.get('invoiceNo')?.setValue(this.ivNum);
    });
  }

  extractLetters(input: string): string {
    return input.replace(/[^a-zA-Z]/g, "");
  }

  slipSub!: Subscription;
  slipStatus: boolean = false
  generateSlip(type: string){
    if(!this.slipForm.valid){
      return alert("Please enter details completely");
    }
    this.slipStatus = true;
    let data = {
      ...this.slipForm.value
    }
    data.entryId = this.peId
    this.slipSub = this.purchaseService.addSlip(data).subscribe(res=>{
      console.log(res);
      this._snackBar.open("Slip created successfully...","" ,{duration:3000})
      if(type === "print"){
        this.router.navigateByUrl('/login/purachases/viewslip')
      }else if(type === "next"){
        this.stepper.next();
      }
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
    console.log(data, this.peId);
    this.purchaseService.updatePE(this.peId, data).subscribe(data => {
      this._snackBar.open("Entry updated successfully...","" ,{duration:3000})
      history.back();
    })
  }

  clearControls() {
    this.purchaseEntryForm.reset();
  }

  paymentMode = [
    {value :"Gpay"},
    {value :"Credit"},
    {value : "Cash"},
    {value : "Cheque"}
  ]

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
