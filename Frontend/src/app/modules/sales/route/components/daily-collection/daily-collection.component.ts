import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router} from '@angular/router';
import { ProductService } from 'src/app/modules/products/product.service';
import { PurchaseService } from 'src/app/modules/purchase/purchase.service';
import { SalesService } from '../../../sales.service';
import { Subscription } from 'rxjs';
import { Customer } from '../../../customers/models/customer';
import { CustomerComponent } from '../../../customers/components/customer/customer.component';
import { UsersComponent } from 'src/app/modules/users/components/users/users.component';
import { User } from 'src/app/modules/users/models/user';
import { UsersService } from 'src/app/modules/users/users.service';
import { RouteComponent } from '../route/route.component';
import { Route } from '../../models/route';
import { RouteDetails } from '../../models/route-details';
import { CustomerLedger } from '../../models/customer-ledger';

// Correct import for operators in RxJS 6+
import { Observable, of } from 'rxjs';


@Component({
  selector: 'app-daily-collection',
  templateUrl: './daily-collection.component.html',
  styleUrls: ['./daily-collection.component.scss']
})
export class DailyCollectionComponent implements OnInit {

  constructor(private fb: FormBuilder, private dialog: MatDialog, private productservice: ProductService,
    private userService :UsersService,private router:Router,
    private salesService: SalesService, private purchaseService: PurchaseService, private route: ActivatedRoute,
    private _snackBar: MatSnackBar) {

      const token: any = localStorage.getItem('token')
      let user = JSON.parse(token)
      console.log(user)
      this.currentUser = user.id

    }
    currentUser : any;
    cusId : any ;
  dailyCollectionId : any;


  ngOnInit(): void {
    this.onCustomerChange();
    this.dailyCollectionId = this.route.snapshot.params['id']
    // this.updateCreditBalance() 
   this.getCustomerLedgerByCustomer()
    this.getCustomer()
    this.getUsers()
    this.getRoutes()
    this.getRouteDetails();
    // this.filterRoutesByCustomer(customerId: any)



    this.dailyCollectionForm.get('userId')?.setValue(this.currentUser)
    this.cusId = this.dailyCollectionForm.get('customerId')?.value
if(this.dailyCollectionId){
  this.patchData()
}
  }


  ngOnDestroy(): void {
    this.customerSub?.unsubscribe();
    this.userSub?.unsubscribe();
    this.routeSub?.unsubscribe();
  }


  dailyCollectionForm = this.fb.group({

     customerId : [  ,Validators.required],
     amount: [null, Validators.required],
    date :[  , Validators.required],
    invoiceNo :[  , Validators.required],
    userId : [  , Validators.required],
    paymentMode  : [  , Validators.required],
    remarks :[  ],
    routeId :  [  , Validators.required],
    creditBalance:[  , Validators.required], 

  });


  onSubmit(){
    this.isEdit=true;
    if(!this.dailyCollectionForm.valid){
      return alert("Please fill the form correctly")
    }
    console.log(this.dailyCollectionForm.getRawValue());

    this.salesService.addDailyCollection(this.dailyCollectionForm.getRawValue()).subscribe((result) => {
      console.log('POST API' ,result);
      this._snackBar.open( "Daily collection added successfully...","" ,{duration:3000})
     this.clearControls();

  })
}


clearControls() {
  this.dailyCollectionForm.reset();
  this.router.navigateByUrl("/login/sales/routesale/viewDailyCollection");

}


  customerSub!: Subscription;
  customers: Customer[] = [];
  getCustomer(value?: string){
    this.customerSub = this.salesService.getCustomer().subscribe(customer => {
      console.log(customer);
      this.customers = customer
      this.filteredCustomer = customer
      if(value){
        this.filterCustomer(value);
      }
    })
  }

  filteredCustomer: Customer[] = [];
  filterCustomer(event: Event | string) {
    let value: string = "";

    if (typeof event === "string") {
      value = event;
    } else if (event instanceof Event) {
      value = (event.target as HTMLInputElement).value;
    }
    this.filteredCustomer = this.customers.filter((option) => {
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

  addCustomer(){
    const dialogRef = this.dialog.open(CustomerComponent, {
      data: { status: "true", category: "Route"},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getCustomer(result?.customer);
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

        this.dailyCollectionForm.get('userId')?.setValue(result.user.id);
      });
    });
  }


  paymentMode = [
    {value :"Gpay"},
    {value :"Credit"},
    {value : "Cash"},
    {value : "Cheque"}
  ]
  addRoute(value?: string){
    const dialogRef = this.dialog.open(RouteComponent, {
      data: { status: "true"},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getRoutes(result?.route);
    });
  }

  routes: Route[] = [];
  routeSub!: Subscription

  getRoutes(value?: string) {
    this.routeSub = this.salesService.getRoute().subscribe(data => {
      this.routes = data;
      // this.filteredRoutes = data;
      console.log(this.filteredRoutes);

      if (value) {
        this.filterRoutesByCustomer(+value); // Convert value to number if needed
      }
    });
  }

routeDetails:RouteDetails[]=[]
  getRouteDetails(){
    this.routeSub = this.salesService.getRouteDetails().subscribe(res => {
      this.routeDetails= res

      console.log("ROUTE DETAILS",this.routeDetails)
      
      // if (value) {
      //   this.filterRoutesByCustomer(+value); // Convert value to number if needed
      // }
    });
    

  }

  filteredRoutes:RouteDetails[]=[]
  filterRoutesByCustomer(customerId: any) {
    this.filteredRoutes = this.routeDetails.filter(route => route.customerId === customerId);

    console.log("FILITERED ROUTE",this.filteredRoutes)
  }



  cusLedger :CustomerLedger[]=[]
  getCustomerLedgerByCustomer(){
    this.salesService.getLedger().subscribe((res)=>{
      this.cusLedger = res;
      console.log("ALL CUST LED",this.cusLedger)
    })

  }

  filiterledger: CustomerLedger[] = [];
  filiterLedgerByCustomer(customerId: any) {
    this.filiterledger = this.cusLedger.filter(x => x.customerId === customerId);
  
    console.log("FILITERED LEDGER", this.filiterledger);
  
  // Assign debit value to const debit
  const debit = this.filiterledger.find(x => x.debit !== undefined)?.debit;
  console.log("DEBIT", debit);

  // Assign amount value to const amount
  const amount = this.dailyCollectionForm.get('amount')?.value;

  // Type check to ensure amount is defined
  if (amount !== null && amount !== undefined) {
    // Calculate the difference between debit and amount
    const difference: any = amount - (debit || 0);

    console.log("DIFFERENCE", difference);

    // Patch the credit balance form control
    const creditBalanceControl = this.dailyCollectionForm.get('creditBalance');
    if (creditBalanceControl !== null) {
      creditBalanceControl.patchValue(difference);
    }
  }

  }
  onAmountChange() {
    const customerId = this.dailyCollectionForm.get('customerId')?.value;
    const amount = this.dailyCollectionForm.get('amount')?.value;
  
    if (customerId !== null && customerId !== undefined && amount !== null && amount !== undefined) {
      const debit = this.filiterledger.find(x => x.debit !== undefined)?.debit || 0;
  
      // Reverse the calculation: debit - amount
      const creditBalanceValue = debit - amount;
  
      // Patch the credit balance form control with type assertion
      const creditBalanceControl = this.dailyCollectionForm.get('creditBalance');
      if (creditBalanceControl !== null) {
        creditBalanceControl.patchValue(creditBalanceValue as any);
      }
    }
  }
  
  
  // private updateCreditBalance() {
  //   const customerId = this.dailyCollectionForm.get('customerId')?.value;
  //   const amount = this.dailyCollectionForm.get('amount')?.value;
  
  //   console.log('customerId:', customerId);
  //   console.log('amount:', amount);
  
  //   // Check if customerId and amount are not null or undefined
  //   if (customerId !== null && customerId !== undefined && amount !== null && amount !== undefined) {
  //     const debit = this.filiterledger.find(x => x.customerId === customerId)?.debit || 0;
  //     const difference = amount - debit;
  
  //     console.log('debit:', debit);
  //     console.log('difference:', difference);
  
  //     // Patch the credit balance form control
  //     const creditBalanceControl = this.dailyCollectionForm.get('creditBalance');
  //     if (creditBalanceControl !== null) {
  //       console.log('Patching credit balance:', difference);
  //       creditBalanceControl.patchValue(difference !== null ? difference : (null as any));
  //     }
  //   }
  // }
  
  
  

  filiteredCusLedger :CustomerLedger[]=[]
  getCustomerLedger( customerId : any){
    // this.salesService.getLedgerByCustomer(this.cId).subscribe((res)=>{
      this.filiteredCusLedger = this.cusLedger.filter(x=>x.customerId==customerId)
      console.log("FILITERED CUST LED",this.cusLedger)
 
    
  }



   
  filiterCustomerBalance(customerId: any): void {
    // this.salesService.getCustomerLedgerByCustomerId(customerId)
    //   .subscribe(
    //     (data: CustomerLedger) => {
    //       this.filiterCusLedger = data;
    //       console.log("Happy", this.filiterCusLedger);
    //     },
    //     (error) => {
    //       console.error(error);
    //     }
    //   );
  }

  // Add this method to your component
  cId: any;

  onCustomerChange(): void {
    const selectedCustomerId = this.dailyCollectionForm.get('customerId')?.value;
    this.filterRoutesByCustomer(selectedCustomerId); 
    // this.updateCreditBalance();
    // this.updateCreditBalance
    this.filiterLedgerByCustomer(selectedCustomerId)
    this.getCustomerLedger(selectedCustomerId); /// You need to implement this method
 // You need to implement this method
    
  }

isEdit : boolean = false

  // patchData(){
  //   this.isEdit = true;
  //   this.salesService.getDailyCollectionById(this.dailyCollectionId).subscribe((res)=>{
  //     let dc = res;

  //     console.log("GET BY ID API RES" ,dc)

  //      let customerId : any = dc.customerId;
  //      let amount : any = dc.amount;
  //      let date  : any = dc.date;
  //      let invoiceNo : any  = dc.invoiceNo;
  //      let userId  : any  = dc.userId;
  //      let paymentMode  : any  = dc.paymentMode;
  //      let remarks  : any  = dc.remarks;
  //      let routeId  : any = dc.routeId;
  //      console.log(dc.routeId)
  //      let creditBalance : any  = dc.creditBalance;

  //      this.dailyCollectionForm.patchValue({
           
  //        customerId : customerId,
  //        amount :amount,
  //        date :date,
  //        invoiceNo :invoiceNo,
  //        userId : userId ,
  //        paymentMode :paymentMode,
  //        remarks :remarks,
  //        routeId :routeId,
  //        creditBalance : creditBalance



  //      })

  //   })





  // }
  patchData() {
  this.isEdit = true;
  this.salesService.getDailyCollectionById(this.dailyCollectionId).subscribe((res) => {
    let dc = res;

    console.log("GET BY ID API RES", dc);

    let customerId: any = dc.customerId;
    let amount: any = dc.amount;
    let date: any = dc.date;
    let invoiceNo: any = dc.invoiceNo;
    let userId: any = dc.userId;
    let paymentMode: any = dc.paymentMode;
    let remarks: any = dc.remarks;
    let routeId: any = dc.routeId;
    let creditBalance: any = dc.creditBalance;

    this.filterRoutesByCustomer(customerId); 

    // Ensure routeId is defined before patching
    if (routeId !== undefined && routeId !== null) {
      this.dailyCollectionForm.patchValue({
        customerId: customerId,
        amount: amount,
        date: date,
        invoiceNo: invoiceNo,
        userId: userId,
        paymentMode: paymentMode,
        remarks: remarks,
        routeId: routeId,
        creditBalance: creditBalance,
      });
    } else {
      // Handle the case where routeId is not defined
      console.error("RouteId is not defined in the response.");
    }
  });
}


  edit! : Subscription
  editFunction(){

    this.isEdit = true;
    let data = {
      ...this.dailyCollectionForm.value
    }
        this.edit = this.salesService.updateDailyCollection(this.dailyCollectionId , data).subscribe((res)=>{
          console.log("Edited responses ",res)
          history.back();
          this._snackBar.open("Daily collection updated successfully","",{duration:3000})
        })



  }
}  
