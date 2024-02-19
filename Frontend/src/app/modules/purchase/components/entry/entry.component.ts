import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormArray, FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { ProductComponent } from 'src/app/modules/products/components/product/product.component';
import { UnitComponent } from 'src/app/modules/products/components/unit/unit.component';
import { Product } from 'src/app/modules/products/models/product';
import { SecondaryUnit } from 'src/app/modules/products/models/secondary-unit';
import { ProductService } from 'src/app/modules/products/product.service';
import { StoreComponent } from 'src/app/modules/store/components/store/store.component';
import { Store } from 'src/app/modules/store/models/store';
import { StoreService } from 'src/app/modules/store/store.service';
import { UsersComponent } from 'src/app/modules/users/components/users/users.component';
import { User } from 'src/app/modules/users/models/user';
import { UsersService } from 'src/app/modules/users/users.service';
import { PurchaseService } from '../../purchase.service';
import { SlipComponent } from '../slip/slip.component';
import { Distributor } from 'src/app/modules/products/models/distributor';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss']
})
export class EntryComponent implements OnInit {

 
  constructor(private fb: FormBuilder, public purchaseService: PurchaseService, public dialog: MatDialog,
    private router: Router, private route: ActivatedRoute, private storeService: StoreService,
    private userService: UsersService, private productService: ProductService) {
    //User
    const token: any = localStorage.getItem("token");
    let user = JSON.parse(token);
    this.id = user.id;
  }

  ngOnDestroy() {
    this.storeSub?.unsubscribe();
    this.userSub?.unsubscribe();
    this.productSub?.unsubscribe();
    this.unitSub?.unsubscribe();
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
    this.getDistributors()
    this.getStores();
    this.getUsers();
    this.getProduct();
    this.getSecondaryUnit();
    this.generateInvoiceNumber();
    this.addProduct();
    let requestId = this.route.snapshot.params['id'];
  //   if(requestId){
  //     this.patchData(requestId)
  //   }

  
  if (this.currentMonth < 10) {
    this.finalMonth = "0" + this.currentMonth;
  } else {
    this.finalMonth = String(this.currentMonth);
  }

  if (this.currentDay < 10) {
    this.finalDay = "0" + this.currentDay;
  } else {
    this.finalDay = String(this.currentDay);
  }

  
  this.todayDate =
    this.currentYear + "-" + this.finalMonth + "-" + this.finalDay;

  
  const formattedDate = new Date(this.todayDate);
;

// this.purchaseEntryForm
// .get("purachseDate")
// ?.setValue(formattedDate.toISOString().split("T")[0]);
  }

  purchaseEntryForm = this.fb.group({
    
    purchaseOrderId : [ ],
    userId :  [] ,
    purchaseInvoice :  ["" ],
    purachseDate:  [],
    paymentMode:  ["" ],
    payMode:[""],
    purchaseAmount: [],
    eWayBillNo:  [ ],
    loading: [],
    transportationCharge:  [],
    unloading:  [],
    unloadingTeam:  [],
    commission:  [],
    chequeNo: [ ],
    entryDetails: this.fb.array([]),
  });

  products(): FormArray {
    return this.purchaseEntryForm.get("entryDetails") as FormArray;
  }

  newProduct(initialValue?: any): FormGroup {
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

  storeSub!: Subscription;
  stores: Store[] = [];
  getStores(value?: string) {
    this.storeSub = this.storeService.getStore().subscribe((store) => {
      this.stores = store;
      this.filteredStore = store;

      if(value){
        this.filterStore(value);
      }
    })
  }

  addStore(){
    const dialogRef = this.dialog.open(StoreComponent, {
      data: { status: "true"},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getStores()
      console.log((result.store.id));

      // this.purchaseEntryForm.get('storeId')?.setValue(result.store.id);
    });
  }

  filteredStore: Store[] = [];
  filterStore(event: Event | string) {
    let value: string = "";

    if (typeof event === "string") {
      value = event;
    } else if (event instanceof Event) {
      value = (event.target as HTMLInputElement).value;
    }
    this.filteredStore = this.stores.filter((option) => {
      if (
        (option.storeName &&
          option.storeName.toLowerCase().includes(value?.toLowerCase()))
      ) {
        return true;
      } else {
        return null;
      }
    });
  }

  userSub!: Subscription;
  users : User[] = [];
  getUsers(value?: string){
    this.userSub = this.userService.getUser().subscribe((users) =>{
      this.users = users;
      this.filteredUser = users;

      if(value){
        this.filterUser(value);
      }
    })
  }

  filteredUser: User[] = [];
  filterUser(event: Event | string) {
    let value: string = "";

    if (typeof event === "string") {
      value = event;
    } else if (event instanceof Event) {
      value = (event.target as HTMLInputElement).value;
    }
    this.filteredUser = this.users.filter((option) => {
      if (
        (option.name &&
          option.name.toLowerCase().includes(value?.toLowerCase()))
      ) {
        return true;
      } else {
        return null;
      }
    });
  }

  addUser(){
    const dialogRef = this.dialog.open(UsersComponent, {
      data: { status: "true"},
    });

    dialogRef.afterClosed().subscribe((result) => {
      dialogRef.afterClosed().subscribe((result) => {
        this.getUsers()
        console.log((result.user.id));

        this.purchaseEntryForm.get('userId')?.setValue(result.user.id);
      });
    });
  }

  productSub!: Subscription;
  product: Product[] = [];
  getProduct(value?:any){
    this.productService.getProduct().subscribe((products) =>{
      this.product = products
      this.filteredOptions = products
      if(value){
        this.filterOptions(value)
      }
    })
  }

  myControl = new FormControl<string | Product>("");
  filteredOptions: any
  filterOptions(event: Event) {

    let value = (event.target as HTMLInputElement).value;
    this.filteredOptions = this.product.filter((option) => {
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

      this.products().at(i).get('productId')?.setValue(result.product.id);
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

      this.products().at(i).get('secondaryUnitId')?.setValue(result.unit.id);
    });
  }

  ivNum: string = "";
  nextId!: any;
  prefix!: string;
  prSub!: Subscription;
  generateInvoiceNumber() {
    this.prSub = this.userSub = this.purchaseService.getPR().subscribe((res) => {
      let purchases = res;

      // Check if there are any employees in the array
      if (purchases.length > 0) {
        const maxId = purchases.reduce((prevMax, inv) => {
          console.log(inv);
          // Extract the numeric part of the employee ID and convert it to a number
          const idNumber = parseInt(inv.requestNo.substring(5), 10);
          console.log(idNumber);

          this.prefix = this.extractLetters(inv.requestNo);

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
        this.prefix = "INVPR";
      }

      const paddedId = `${this.prefix}${this.nextId
        .toString()
        .padStart(3, "0")}`;

      this.ivNum = paddedId;

      // this.purchaseEntryForm.get("requestNo")?.setValue(this.ivNum);
    });
  }

  extractLetters(input: string): string {
    return input.replace(/[^a-zA-Z]/g, "");
  }

  addProduct(){
    this.products().push(this.newProduct());
  }

  removeProduct(i: number){
    this.products().removeAt(i);
  }

  submitSub!: Subscription;
  onSubmit(){
    if(this.purchaseEntryForm.valid){
      let form = {
        ...this.purchaseEntryForm.value
      }
      // form.purachseDate = moment(this.purchaseEntryForm.value.purachseDate).format('YYYY-MM-DD HH:mm:ss');

      this.submitSub = this.purchaseService.addPE(form).subscribe((res) =>{
        console.log(res)
        // this.clearControls()
      },
      (error) => {
        alert(error);
      })
    }
  }



  clearControls() {
    this.purchaseEntryForm.reset();
    this.router.navigateByUrl("/login/purachases/viewpurchaserequest");
  }

  // prId!: number;
  // patchData(id: number){
  //   this.purchaseService.getPRById(id).subscribe(res=>{
  //     this.prId = id;
  //       this.editstatus = true
  //       let pr = res

  //       let requestNo = pr.requestNo.toString();
  //       let store: any = pr.storeId;
  //       let user: any = pr.userId;
  //       let date: any = pr.date;

  //       this.purchaseEntryForm.patchValue({
  //         requestNo : requestNo,
  //         storeId : store,
  //         userId : user,
  //         date : date
  //       })

  //       const pd = this.purchaseEntryForm.get("entryDetails") as FormArray;
  //       pd.clear();
  //       let rDetails = res.entryDetails;
  //       if (rDetails && rDetails.length > 0) {
  //         rDetails.forEach((detail: any) => {
  //           console.log(detail);

  //         const details = this.fb.group({
  //           productId : detail.productId,
  //           quantity : detail.quantity,
  //           secondaryUnitId : detail.secondaryUnitId
  //         });

  //         pd.push(details);
  //       });
  //     }
  //   })
  // }

  // update(){
  //   this.purchaseService.updatePR(this.prId, this.purchaseEntryForm.getRawValue()).subscribe((res)=>{
  //     this.clearControls()
  //   })
  // }


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
  commissionApplicable: boolean = false; // Initialize it based on your default value or logic

  
  onCommissionApplicableChange() {
    const commissionControl = this.purchaseEntryForm.get('commission');
    if (commissionControl) {
      this.commissionApplicable = commissionControl.value === 'yes'; // Update this based on your actual values
    }
  }

  unloadingApplicable : boolean = false
  onUnloadingApplicable(){
    const commissionControl = this.purchaseEntryForm.get('unloading');
    if (commissionControl) {
      this.unloadingApplicable = commissionControl.value === 'yes'; 
      
    }



  }
  
  addSlip(): void {
    const dialogRef = this.dialog.open(SlipComponent, {
      data: { status: 'add', type: 'add', unit: 'secondary' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      // Handle the result if needed
      // this.getUnit(result?.unit);
    });
  }

  onRadioChange(): void {
    console.log('Radio changed');
    const payModeControl = this.purchaseEntryForm.get('payMode');

    if (payModeControl && payModeControl.value === 'slipissued') {
      this.addSlip();
    }
  }

  
  distributors :any;
  getDistributors(){
   this.productService.getDistributor().subscribe((res=>{
    this.distributors = res;
   }))
 
  }

}