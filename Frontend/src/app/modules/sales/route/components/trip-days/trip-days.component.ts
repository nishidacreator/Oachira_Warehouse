import { Component, EventEmitter, Inject, OnInit, Optional, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { DeleteDialogueComponent } from 'src/app/modules/shared-components/delete-dialogue/delete-dialogue.component';
import { SalesService } from '../../../sales.service';
import { RouteDays } from '../../models/route-days';
import { RouteDaysComponent } from '../route-days/route-days.component';
import { RouteComponent } from '../route/route.component';
import { Route } from '../../models/route';
import { TripDays } from '../../models/trip-days';

@Component({
  selector: 'app-trip-days',
  templateUrl: './trip-days.component.html',
  styleUrls: ['./trip-days.component.scss']
})
export class TripDaysComponent implements OnInit {

  id: number = 0;
  constructor(private fb: FormBuilder,public salesService: SalesService, private _snackBar: MatSnackBar,
    public dialog: MatDialog, private router: Router, private route: ActivatedRoute,
    @Optional() public dialogRef: MatDialogRef<RouteDaysComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any){

  }

  @Output() dataSubmitted: EventEmitter<any> = new EventEmitter<any>();

  ngOnDestroy(){
    this.daysSubscription?.unsubscribe()
    if(this.routeSub){
      this.routeSub.unsubscribe()
    }
    if(this.delete){
      this.delete.unsubscribe()
    }
    if(this.edit){
      this.edit.unsubscribe()
    }
    if(this.submit){
      this.submit.unsubscribe()
    }
  }

  tripDaysForm = this.fb.group({
    routeId: ['', Validators.required],
    weekDays : ['', Validators.required],
  });

  displayedColumns : string[] = ['id','routeId', 'weekDay','manage']

  addStatus!: string;
  ngOnInit(): void {
    this.getRoute()
    this.getTripDays()
    this.getComplete()
    if (this.dialogRef) {
      this.addStatus = this.dialogData?.status;
      if(this.dialogData.type === 'edit'){
        this.patchData();
      }
    }
  }

  routes: Route[] = [];
  getRoute(value?: string){
    this.salesService.getRoute().subscribe(route =>{
      this.routes = route
      this.filteredRoute = route
      if(value){
        this.filterRoute(value)
      }
    });
  }

  addRoute(){
    const dialogRef = this.dialog.open(RouteComponent, {
      data: { status: "true"},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getRoute(result?.route);
    });
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
          option.routeName.toLowerCase().includes(value?.toLowerCase()))
      ) {
        return true;
      } else {
        return null;
      }
    });
  }

  weekDays =[
    {name: 'Sunday', abbreviation: 'SUN', index: 0},
    {name: 'Monday', abbreviation: 'MON', index: 1},
    {name: 'Tuesday', abbreviation: 'TUE', index: 2},
    {name: 'Wednesday', abbreviation: 'WED', index: 3},
    {name: 'Thursday', abbreviation: 'THU', index: 4},
    {name: 'Friday', abbreviation: 'FRI', index: 5},
    {name: 'Saturday', abbreviation: 'SAT', index: 6},
  ];

  routeSub!: Subscription;
  getRouteById(){
    this.routeSub = this.salesService.getRouteById(this.id).subscribe(result => {
      let routeName: any = result.id;

      this.tripDaysForm.patchValue({
        routeId: routeName
      })
    })
  }

  submit!: Subscription;
  onSubmit(){
    if(!this.tripDaysForm.valid){
      return alert('Please fill the form first')
    }
    this.submit = this.salesService.addTripDays(this.tripDaysForm.getRawValue()).subscribe((res)=>{
      this._snackBar.open("Trip days added successfully...","" ,{duration:3000})
      this.clearControls()
    },(error=>{
      alert(error)
    }))
  }

  clearControls(){
    this.getTripDays()
    this.tripDaysForm.reset()
    this.tripDaysForm.setErrors(null)
    Object.keys(this.tripDaysForm.controls).forEach(key=>{this.tripDaysForm.get(key)?.setErrors(null)})
  }

  pageSize = 10;
  currentPage = 1;
  totalItems = 0;
  filterValue = "";
  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getTripDays();
  }

  days : TripDays[] = [];
  daysSubscription!: Subscription
  getTripDays(){
    this.daysSubscription = this.salesService.getPaginatedTripDays(this.filterValue, this.currentPage, this.pageSize).subscribe((res: any)=>{
      this.filtered = res.items
      this.totalItems = res.count;
    })
  }

  detailSub!: Subscription;
  getComplete(){
    this.detailSub = this.salesService.getTripDays().subscribe((res:any)=>{
      this.days = res;
    })
  }

  filtered!: TripDays[];
  applyFilter(event: Event): void {
    if((event.target as HTMLInputElement).value.trim() === '') {
      this.getTripDays();
    }else{
      const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
      this.filtered = this.days.filter(element =>
        element.route.routeName.toLowerCase().includes(filterValue)
        || element.id.toString().includes(filterValue)
        || element.weekDay.toLowerCase().includes(filterValue)
      );
    }
  }

  delete!: Subscription;
  deleteDays(id : any){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.delete = this.salesService.deleteTripDays(id).subscribe((res)=>{
          this.getTripDays()
          this._snackBar.open("Trip Days deleted successfully...","" ,{duration:3000})
        },(error=>{
          this._snackBar.open(error.error.message,"" ,{duration:3000})
        }))
      }
    })
  }

  isEdit = false;
  dayId : any;
  isDisabled = true;
  editDays(id : any){
    const dialogRef = this.dialog.open(TripDaysComponent, {
      data: { status: "true" , type : "edit", id: id},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getRoute();
    });
  }

  patchData(){
    this.isEdit = true;
    //Get the product based on the ID
    this.salesService.getTripDayById(this.dialogData.id).subscribe((result) => {
      let day = result

      //Populate the object by the ID
      let routeId: any = day.routeId;
      let weekDays = day.weekDay.toString();
      console.log(day);

      this.tripDaysForm.patchValue({
        routeId : routeId,
        weekDays : weekDays
      })
      this.dayId = this.dialogData.id;
    })
  }

  edit!: Subscription
  editFunction(){
    if(!this.tripDaysForm.valid){
      return alert('Please fill the form first')
    }
    this.isEdit = false;

    let data: any ={
      routeId : this.tripDaysForm.get('routeId')?.value,
      weekDays : this.tripDaysForm.get('weekDays')?.value,
    }

    this.edit = this.salesService.updateTripDays(this.dayId, data).subscribe((res)=>{
      this._snackBar.open("Trip Days updated successfully...","" ,{duration:3000})
      this.clearControls();
      this.dialogRef?.close()
    },(error=>{
          alert(error.message)
        }))
  }

  addArray(){
    let data ={
      days : this.tripDaysForm.getRawValue().weekDays,
      collectStatus : 'true'
    }

    this.dataSubmitted.emit(data);
    this.dialogRef.close(data);
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }
}


