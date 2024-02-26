import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
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



  ngOnInit(): void {
    this.getCustomer()
    this.getUsers()
    this.getRoutes()

    this.dailyCollectionForm.get('userId')?.setValue(this.currentUser)
    this.cusId = this.dailyCollectionForm.get('customerId')

  }


  ngOnDestroy(): void {
    this.customerSub?.unsubscribe();
    this.userSub?.unsubscribe();
    this.routeSub?.unsubscribe();
  }


  dailyCollectionForm = this.fb.group({

     customerId : [],
    amount: [],
    date : [],
    invoiceNo : [],
    userId :  [],
    paymentMode  :  [],
    remarks : [],
    routeId :  [''],
    creditBalance  :  [],

  });


  onSubmit(){
    if(!this.dailyCollectionForm.valid){
      return alert("Please fill the form correctly")
    }
    console.log(this.dailyCollectionForm.getRawValue());

    this.salesService.addDailyCollection(this.dailyCollectionForm.getRawValue()).subscribe((result) => {
      console.log('POST API' ,result);
      this._snackBar.open( "Daily collection updated successfully...","" ,{duration:3000})
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
  addRoute(){
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
      this.filteredRoutes = data;
      console.log(this.filteredRoutes);

      if (value) {
        this.filterRoutesByCustomer(+value); // Convert value to number if needed
      }
    });
  }
  filteredRoutes:Route[]=[]
  filterRoutesByCustomer(customerId: any) {
    this.filteredRoutes = this.routes.filter(route => route.routeDetails.customerId === customerId);
  }

  // cusLedger :CustomerLedger[]=[]
  // getCustomerLedgerByCustomerId( cId : any){
  //   this.salesService.getLedgerByCustomer(this.cId).subscribe((res)=>{
  //     this.cusLedger = res;
  //     console.log("Jiiiiii",this.cusLedger)
  //   })

  // }

  cusLedger :CustomerLedger[]=[]
  getCustomerLedgerByCustomerId(){
    this.salesService.getLedger().subscribe((res)=>{
      this.cusLedger = res;
      console.log("Jiiiiii",this.cusLedger)
    })

  }

  filiterCusLedger!: CustomerLedger;

  filiterCustomerBalance(customerId: any): void {
    this.salesService.getCustomerLedgerByCustomerId(customerId)
      .subscribe(
        (data: CustomerLedger) => {
          this.filiterCusLedger = data;
          console.log("Happy", this.filiterCusLedger);
        },
        (error) => {
          console.error(error);
        }
      );
  }

  // Add this method to your component
  cId: any;

  onCustomerChange(): void {
    const selectedCustomerId = this.dailyCollectionForm.get('customerId')?.value;
    this.cId = selectedCustomerId;
    this.filiterCustomerBalance(selectedCustomerId);
    // this.getCustomerLedgerByCustomerId(); // You need to implement this method
    this.filterRoutesByCustomer(selectedCustomerId); // You need to implement this method
  }
}
