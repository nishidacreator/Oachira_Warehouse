import { Component, Inject, OnDestroy, OnInit, Optional } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SalesService } from '../../../sales.service';
import { Subscription } from 'rxjs';
import { Route } from '../../models/route';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RouteComponent } from '../route/route.component';
import { Customer } from '../../../customers/models/customer';
import { UsersService } from 'src/app/modules/users/users.service';
import { User } from 'src/app/modules/users/models/user';
import { CustomerComponent } from '../../../customers/components/customer/customer.component';
import { UsersComponent } from 'src/app/modules/users/components/users/users.component';
import { ActivatedRoute } from '@angular/router';
import { PickListComponent } from '../pick-list/pick-list.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-trip',
  templateUrl: './trip.component.html',
  styleUrls: ['./trip.component.scss']
})
export class TripComponent implements OnInit, OnDestroy {

  constructor(private fb: FormBuilder, private salesService: SalesService, private dialog: MatDialog,
    private userService: UsersService, @Optional() public dialogRef: MatDialogRef<TripComponent>,
    private route: ActivatedRoute, @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any,
    private _snackBar: MatSnackBar) { }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
    this.routeIdSub?.unsubscribe();
    this.routeDetailsSub?.unsubscribe();
  }

  tripForm = this.fb.group({
    routeId : ['', Validators.required],
    date: ['', Validators.required],
    driver: ['', Validators.required],
    salesMan: ['', Validators.required],
    customers: this.fb.array([])
  });

  customers() : FormArray {
    return this.tripForm.get("customers") as FormArray
  }

  newCustomer(): FormGroup {
    return this.fb.group({
      customerId: ['', Validators.required],
      invoiceNo: [''],
      amount: [0]
    })
  }

  addCustomer() {
    this.customers().push(this.newCustomer());
  }

  removeCustomer(i:number) {
    this.customers().removeAt(i);
  }

  ngOnInit(): void {
    this.getRoute();
    this.getDriver();
    this.getCustomer();
    this.addCustomer();

    let id = this.route.snapshot.params['id'];
    if(id){
      this.patchData(id)
    }
  }

  routeSub!: Subscription;
  routes: Route[] = [];
  getRoute(value?: string){
    this.routeSub = this.salesService.getRoute().subscribe(r => {
      this.routes = r;
      this.filteredRoute = r;
      console.log(this.routes);

    })
  }

  filteredRoute: Route[] = [];
  filterRoute(event: Event | string) {
    let value: string = "";

    if (typeof event === "string") {
      value = event;
    } else if (event instanceof Event) {
      value = (event.target as HTMLInputElement).value;
    }
    this.filteredRoute = this.routes.filter((option) => {
      if (
        (option.routeName &&
          option.routeName
          .toLowerCase().includes(value?.toLowerCase()))
      ) {
        return true;
      } else {
        return null;
      }
    });
  }

  addRoute(){
    const dialogRef = this.dialog.open(RouteComponent, {
      data: { status: "true"},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getRoute(result.user);
    });
  }

  customer: Customer[] = [];
  weekDay: any[] = [];
  routeIdSub!: Subscription;
  routeDetailsSub!: Subscription;
  byRouteId(id: number){
    //ROUTE
    this.routeIdSub = this.salesService.getRouteById(id).subscribe((res)=>{
      let driverName = res.driver.name
      let salesmanName = res.salesMan.name

      this.tripForm.patchValue({
        driver : driverName,
        salesMan : salesmanName
      })

      this.routeDetailsSub = this.salesService.getRouteDetailsByRouteId(id).subscribe((res)=>{
        let details = res
        console.log(details);

        this.filteredCustomer = res.map(x => x.customer);

        //DELIVERY DAYS
        return this.salesService.getTripDayByRouteId(id).subscribe((res)=>{
          let days = res
          for(let i = 0; i < days.length; i++){
            this.weekDay[i] = days[i].weekDay
          }
        })
      })
    })
  }

  weekdayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    const weekdayName = this.weekdayNames[day];
    return this.weekDay.includes(weekdayName);
  };

  driver : User[] = [];
  salesMan : User[] = [];
  userSubscription! : Subscription;
  getDriver(value?:string){
    this.userSubscription = this.userService.getUser().subscribe((res)=>{
      this.driver = res.filter(x => x.role.roleName.toLowerCase() == 'driver');
      this.filteredDriver = this.driver
      this.salesMan = res.filter(x => x.role.roleName.toLowerCase() == 'salesman');
      this.filteredSalesMan = this.salesMan
      if(value){
        this.filterDriver(value);
        this.filterSalesMan(value);
      }
    })
  }

  filteredDriver: User[] = [];
  filterDriver(event: Event | string) {
    let value: string = "";

    if (typeof event === "string") {
      value = event;
    } else if (event instanceof Event) {
      value = (event.target as HTMLInputElement).value;
    }
    this.filteredDriver = this.driver.filter((option) => {
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

  filteredSalesMan: User[] = [];
  filterSalesMan(event: Event | string) {
    let value: string = "";

    if (typeof event === "string") {
      value = event;
    } else if (event instanceof Event) {
      value = (event.target as HTMLInputElement).value;
    }
    this.filteredSalesMan = this.salesMan.filter((option) => {
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

  addUser(role: string){
    const dialogRef = this.dialog.open(UsersComponent, {
      data: { status: "true", role: role},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getDriver(result.user);
    });
  }

  customersSub!: Subscription;
  customerss: Customer[] = [];
  getCustomer(value?: string){
    this.customersSub = this.salesService.getCustomer().subscribe(r => {
      this.customerss = r;
      this.filteredCustomer = r;
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
    this.filteredRoute = this.routes.filter((option) => {
      if (
        (option.routeName &&
          option.routeName
          .toLowerCase().includes(value?.toLowerCase()))
      ) {
        return true;
      } else {
        return null;
      }
    });
  }

  addCustomerCompo(){
    const dialogRef = this.dialog.open(CustomerComponent, {
      data: { status: "true"},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getRoute(result.user);
    });
  }

  onSubmit(){
    if(!this.tripForm.valid){
      return alert("Please fill the form correctly")
    }
    console.log(this.tripForm.getRawValue());

    this.salesService.addTrip(this.tripForm.getRawValue()).subscribe((result) => {
      console.log(result);
      let data = {
        route: this.tripForm.get('routeName')?.value
      }
      this.dialogRef?.close(data);
      this._snackBar.open("PickList added successfully...","" ,{duration:3000})
      this.clearControls()
    });

  }

  clearControls(){
    this.tripForm.reset()
  }

  isEdit: boolean = false;
  tripId!: number;
  patchData(id: number){
    this.isEdit = true;
    this.salesService.getTripById(id).subscribe(data =>{
      console.log(data);

      let list = data
      this.tripId = list.id;
      let route: any = list.route.id;
      let driver: any = list.driver;
      let salesman: any = list.salesMan;
      let date: any = list.date;

      this.byRouteId(route)
      this.tripForm.patchValue({
        routeId: route,
        driver: driver,
        salesMan: salesman,
        date: date
      })

      const trip = this.tripForm.get("customers") as FormArray;
      trip.clear();

        let details = list.tripDetails;
        if (details && details.length > 0) {
          details.forEach((detail: any) => {

          const details = this.fb.group({
            customerId : detail.customerId,
            amount : detail.amount,
            invoiceNo : detail.invoiceNo
          });

          trip.push(details);
        })
      }
    });
  }

  editFunction(){
    if(!this.tripForm.valid){
      return alert('Please fill the form first')
    }
    this.isEdit = false;

    let data = {
      routeId: this.tripForm.get('routeId')?.value,
      driver: this.tripForm.get('driver')?.value,
      salesMan: this.tripForm.get('salesMan')?.value,
      date: this.tripForm.get('date')?.value,
      customers: this.tripForm.get('customers')?.value
    }
    this.salesService.updateTrip(this.tripId, data).subscribe(data => {
      this._snackBar.open("PickList added successfully...","" ,{duration:3000})
      this.clearControls()
      history.back();
    });
  }
}
