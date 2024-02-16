import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DeleteDialogueComponent } from 'src/app/modules/shared-components/delete-dialogue/delete-dialogue.component';
import { UsersComponent } from 'src/app/modules/users/components/users/users.component';
import { User } from 'src/app/modules/users/models/user';
import { SalesService } from '../../../sales.service';
import { UsersService } from 'src/app/modules/users/users.service';
import { Route } from '../../models/route';
import { Vehicle } from '../../models/vehicle';
import { PageEvent } from '@angular/material/paginator';
import { VehicleComponent } from '../vehicle/vehicle.component';

@Component({
  selector: 'app-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.scss']
})
export class RouteComponent implements OnInit {

  constructor(private fb: FormBuilder,public salesService: SalesService, private _snackBar: MatSnackBar,
    public dialog: MatDialog, private userService: UsersService, private router: Router,
    @Optional() public dialogRef: MatDialogRef<RouteComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any
    ){
      const token: any = localStorage.getItem('token')
      let user = JSON.parse(token)
      console.log(user)

      // this.branchId = user.branch
    }


  ngOnDestroy(){
    this.routeSubscription?.unsubscribe()
    this.userSubscription.unsubscribe()
    this.routeSub?.unsubscribe()
    if(this.submit){
      this.submit.unsubscribe();
    }
    if(this.delete){
      this.delete.unsubscribe();
    }
    if(this.edit){
      this.edit.unsubscribe();
    }
  }

  routeForm = this.fb.group({
    routeName: ['', Validators.required],
    vehicleId : ['', Validators.required],
    driverId : ['', Validators.required],
    salesManId :['',Validators.required],
    salesExecutiveId : ['', Validators.required]
  });

  displayedColumns : string[] = ['id','routeName', 'vehicleId','vehicleDriverId','salesManId', 'salesExecutiveId','manage']

  addStatus!: string;
  ngOnInit(): void {
    // this.routeForm.get('branchId')?.setValue(this.branchId)

    if (this.dialogRef) {
      this.addStatus = this.dialogData?.status;
      if(this.dialogData.type === 'edit'){
        this.patchData()
      }
    }

    this.getVehicle()
    this.getDriver()
    this.getRoute()
    this.getComplete()
  }

  vehicleSub!: Subscription;
  vehicles: Vehicle[] = [];
  getVehicle(value?: string){
    this.vehicleSub = this.salesService.getVehicle().subscribe(result => {
      this.vehicles = result
      this.filteredVehicle = result
      if(value){
        this.filterVehicle(value)
      }
    })
  }

  filteredVehicle: Vehicle[] = [];
  filterVehicle(event: Event | string) {
    let value: string = "";

    if (typeof event === "string") {
      value = event;
    } else if (event instanceof Event) {
      value = (event.target as HTMLInputElement).value;
    }
    this.filteredVehicle = this.vehicles.filter((option) => {
      if (
        (option.registrationNumber &&
          option.registrationNumber.toLowerCase().includes(value?.toLowerCase()))
      ) {
        return true;
      } else {
        return null;
      }
    });
  }

  addVehicle(){
    const dialogRef = this.dialog.open(VehicleComponent, {
      data: {status : 'true'}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getVehicle(result.vehicle)
    })
  }

  driver : User[] = [];
  salesMan : User[] = [];
  salesExecutive : User[] = [];
  userSubscription! : Subscription;
  getDriver(value?:string){
    this.userSubscription = this.userService.getUser().subscribe((res)=>{
      this.driver = res.filter(x => x.role.roleName.toLowerCase() == 'driver');
      this.filteredDriver = this.driver
      this.salesMan = res.filter(x => x.role.roleName.toLowerCase() == 'salesman');
      this.filteredSalesMan = this.salesMan
      this.salesExecutive = res.filter(x=>x.role.roleName.toLowerCase() == 'salesexecutive');
      this.filteredSalesExe = this.salesExecutive
      if(value){
        this.filterDriver(value);
        this.filterSEx(value);
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

  filteredSalesExe: User[] = [];
  filterSEx(event: Event | string) {
    let value: string = "";

    if (typeof event === "string") {
      value = event;
    } else if (event instanceof Event) {
      value = (event.target as HTMLInputElement).value;
    }
    this.filteredSalesExe = this.driver.filter((option) => {
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

  clearControls(){
    this.getRoute()
    this.routeForm.reset()
  }

  pageSize = 10;
  currentPage = 1;
  totalItems = 0;
  filterValue = "";
  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getRoute();
  }

  routes : Route[] = [];
  routeSubscription? : Subscription
  getRoute(){
    this.routeSubscription = this.salesService.getPaginatedRoute(this.filterValue, this.currentPage, this.pageSize).subscribe((res: any)=>{
      this.filtered = res.items
      this.totalItems = res.count;
    })
  }

  routeSub!: Subscription;
  getComplete(){
    this.routeSub = this.salesService.getRoute().subscribe((res:any)=>{
      this.routes = res;
    })
  }

  filtered!: any[];
  applyFilter(event: Event): void {
    if((event.target as HTMLInputElement).value.trim() === '') {
      this.getRoute();
    }else{
      const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
      this.filtered = this.routes.filter(element =>
        element.routeName.toLowerCase().includes(filterValue)
        || element.id.toString().includes(filterValue)
        || element.status.toString().includes(filterValue)
      );
    }
  }

  onToggleChange(event: any, id: number) {
    const newValue = event.checked;

    let data = {
      status : newValue
    }
    this.salesService.updateRouteStatus(id, data).subscribe(data=>{
      this._snackBar.open("Status updated successfully...","" ,{duration:3000})
    });
  }

  delete!: Subscription;
  deleteRoute(id : any){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.delete = this.salesService.deleteRoute(id).subscribe((res)=>{
          this.getRoute()
          this._snackBar.open("Route deleted successfully...","" ,{duration:3000})
        },(error=>{
          this._snackBar.open(error.error.message,"" ,{duration:3000})
        }))
      }
    })
  }

  isEdit = false;
  routeId : any;
  editRoute(id : any){
    const dialogRef = this.dialog.open(RouteComponent, {
      data: { status: "true" , type : "edit", id: id},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getRoute();
    });
  }

  patchData(){
    this.isEdit = true;
    //Get the product based on the ID
    this.salesService.getRouteById(this.dialogData.id).subscribe(data => {
      let route = data

      //Populate the object by the ID
    let routeName = route.routeName.toString();
    let vehicleId: any = route.vehicleId;
    let driverId: any = route.driverId;
    let salesManId: any = route.salesManId;
    let salesExecutiveId: any = route.salesExecutiveId;

    this.routeForm.patchValue({
      routeName : routeName,
      vehicleId : vehicleId,
      driverId : driverId,
      salesManId : salesManId,
      salesExecutiveId : salesExecutiveId
    })
    this.routeId = this.dialogData.id;
    })
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  edit!: Subscription;
  editFunction(){
    if(!this.routeForm.valid){
      return alert('Please fill the form first')
    }
    this.isEdit = false;

    let data: any ={
      routeName : this.routeForm.get('routeName')?.value,
      vehicleId : this.routeForm.get('vehicleId')?.value,
      driverId : this.routeForm.get('driverId')?.value,
      salesManId : this.routeForm.get('salesManId')?.value,
      salesExecutiveId : this.routeForm.get('salesExecutiveId')?.value,
    }

    this.edit = this.salesService.updateRoute(this.routeId, data).subscribe((res)=>{
      this._snackBar.open("Route updated successfully...","" ,{duration:3000})
      this.clearControls();
      this.dialogRef?.close();
    },(error=>{
          alert(error.message)
        }))
  }

  routeDaysForm = this.fb.group({
    weekDays : ['', Validators.required],
  });

  weekDays =[
    {name: 'Sunday', abbreviation: 'SUN', index: 0},
    {name: 'Monday', abbreviation: 'MON', index: 1},
    {name: 'Tuesday', abbreviation: 'TUE', index: 2},
    {name: 'Wednesday', abbreviation: 'WED', index: 3},
    {name: 'Thursday', abbreviation: 'THU', index: 4},
    {name: 'Friday', abbreviation: 'FRI', index: 5},
    {name: 'Saturday', abbreviation: 'SAT', index: 6},
  ];
  isDisabled = true;

  tripDaysForm = this.fb.group({
    weekDays : ['', Validators.required],
  });

  result : any
  submitted = false;
  submit!: Subscription;
  onSubmit(){
    if(!this.routeForm.valid){
      return alert('Please fill the form first')
    }
    let data ={
      routeName: this.routeForm.get('routeName')?.value,
      vehicleId :this.routeForm.get('vehicleId')?.value,
      driverId : this.routeForm.get('driverId')?.value,
      salesManId :this.routeForm.get('salesManId')?.value,
      salesExecutiveId : this.routeForm.get('salesExecutiveId')?.value,
      // collectionDays : this.collectionDays
    }

    this.salesService.addRoute(data).subscribe((res)=>{
      this.result = res
      let data = {
        route: this.routeForm.get('routeName')?.value
      }
      this.dialogRef?.close(data);
      this._snackBar.open("Customer added successfully...","" ,{duration:3000})
      this.clearControls()
    })
  }

  // collectionDays: any[] =[];
  // addCollectionDays(){
  //   const dialogRef = this.dialog.open(AddRouteDaysComponent, {
  //     data: {status : 'true'}
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log(result)
  //     if(result != undefined){
  //       let collectionDays = result.days
  //       for(let i = 0; i < collectionDays.length; i++){
  //         this.collectionDays[i] = {
  //           weekDays : collectionDays[i]
  //         }
  //       }
  //     }
  //   })
  // }

  // addDeliveryDays(){
  //   const dialogRef = this.dialog.open(TripDaysComponent, {
  //     data: {status : 'true'}
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     this.collectionDays = result.days
  //     console.log(this.collectionDays)
  //   })
  // }

  addDetails(){
    if(this.result){
      let len = this.routes.length;
      let lenght = len + 1;
      console.log(lenght)
      this.router.navigateByUrl('/admin/settings/route/routedetails/'+ lenght)
    }
    else{
      this.router.navigateByUrl('/admin/settings/route/routedetails')
    }
  }
}


