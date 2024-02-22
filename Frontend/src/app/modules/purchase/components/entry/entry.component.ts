import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductService } from 'src/app/modules/products/product.service';
import { PurchaseService } from '../../purchase.service';
import { Distributor } from 'src/app/modules/products/models/distributor';
import { SalesService } from 'src/app/modules/sales/sales.service';
import { Observable } from 'rxjs';
import { DistributorComponent } from 'src/app/modules/products/components/distributor/distributor.component';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss']
})
export class EntryComponent implements OnInit {
  @ViewChild('stepper') stepper!: MatStepper;

  constructor(private fb: FormBuilder, public purchaseService: PurchaseService, public dialog: MatDialog,
    private router: Router, private route: ActivatedRoute, private salesService: SalesService,
    private productService: ProductService) {
    //User
    const token: any = localStorage.getItem("token");
    let user = JSON.parse(token);
    this.id = user.id;
  }

  ngOnDestroy() {
  }

  id!: number;
  addStatus!: string;
  editstatus!: boolean;
  finalMonth: any;
  finalDay: any;
  date1 = new Date();
  currentYear = this.date1.getUTCFullYear();
  currentMonth = this.date1.getUTCMonth() + 1;
  currentDay = this.date1.getUTCDate();

  todayDate = "12-01-2011";
  ngOnInit(): void {
    this.getDistributor()
    this.addProduct();
  }

  purchaseEntryForm = this.fb.group({
    distributorId: ['', Validators.required],
    purchaseInvoice: ['', Validators.required],
    purchaseAmount: [0, Validators.required],
    purachseDate: [''],
    status: [''],
    chequeNo: [''],
    entryDetails: this.fb.array([])
  });

  slipForm = this.fb.group({
    distributorId: [''],
    invoiceNo:[''],
    amount: [''],

    description: [''],
    date: [''],
    contactPerson: ['']
  });

  status = [
    { value: "ChequeIssued" },
    { value: "SlipIssued" }
  ];

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
  getDistributor(value?: string){
    this.distributorSub = this.productService.getDistributor().subscribe(distributor =>{
      this.distributors = distributor
      this.filteredDistributor = distributor;
      if(value){
        this.filterDistributor(value)
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
      this.getDistributor(result?.distributor);
    });
  }

  generateSlip(){}

  submitSub!: Subscription;
  onSubmit(type: string){
    if(this.purchaseEntryForm.valid){
      console.log(this.purchaseEntryForm.getRawValue())
      if(type === "close"){
        history.back();
      }else if(type === "slip"){
        this.stepper.next();
      }
    }
  }

  clearControls() {
    this.purchaseEntryForm.reset();
    this.router.navigateByUrl("/login/purachases/viewpurchaserequest");
  }

  unloading = [
    { value: "Yes" },
    { value: "No" }
  ];

  commission= [
    { value: "Yes" },
    { value: "No" }
  ]

  paymentMode = [
    {value :"Gpay"},
    {value :"Credit"},
    {value : "Cash"},
    {value : "Cheque"}
  ]

  loading = [
    { value: "Yes" },
    { value: "No" }
  ]

  transportationCharge= [
    { value: "Yes" },
    { value: "No" }
  ]



}
