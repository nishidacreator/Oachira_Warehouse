import { Component, EventEmitter, Inject, OnInit, Optional, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { DeleteDialogueComponent } from 'src/app/modules/shared-components/delete-dialogue/delete-dialogue.component';
import { SalesService } from '../../../sales.service';
import { Route } from '../../models/route';
import { RouteDays } from '../../models/route-days';
import { PageEvent } from '@angular/material/paginator';
import { RouteComponent } from '../route/route.component';

@Component({
  selector: 'app-route-days',
  templateUrl: './route-days.component.html',
  styleUrls: ['./route-days.component.scss']
})
export class RouteDaysComponent implements OnInit {

  id: number = 0;
  constructor(private fb: FormBuilder,public salesService: SalesService, private _snackBar: MatSnackBar,
    public dialog: MatDialog, private router: Router, private route: ActivatedRoute,
    @Optional() public dialogRef: MatDialogRef<RouteDaysComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any){

  }

  @Output() dataSubmitted: EventEmitter<any> = new EventEmitter<any>();

  ngOnDestroy(){
    this.daysSubscription?.unsubscribe()
    this.routeSub?.unsubscribe()
    this.delete?.unsubscribe()
    this.edit?.unsubscribe()
    this.submit?.unsubscribe()
    this.routeIdSub?.unsubscribe()
  }

  routeDaysForm = this.fb.group({
    routeId: ['', Validators.required],
    weekDays : ['', Validators.required],
  });

  displayedColumns : string[] = ['id','routeId', 'weekDay','manage']

  addStatus!: string;
  ngOnInit(): void {
    this.getRoute()
    this.getRouteDays()
    this.getComplete()
    if (this.dialogRef) {
      this.addStatus = this.dialogData?.status;
      if(this.dialogData.type === 'edit'){
        this.patchData();
      }
    }
  }

  routes: Route[] = [];
  routeSub!: Subscription
  getRoute(value?: string){
    this.routeSub = this.salesService.getRoute().subscribe(route =>{
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

  routeIdSub!: Subscription;
  getRouteById(){
    this.routeIdSub = this.salesService.getRouteById(this.id).subscribe(result => {
      let routeName: any = result.id;

      this.routeDaysForm.patchValue({
        routeId: routeName
      })
    })
  }

  submit!: Subscription;
  onSubmit(){
    if(!this.routeDaysForm.valid){
      return alert('Please fill the form first')
    }
    this.submit = this.salesService.addRouteDays(this.routeDaysForm.getRawValue()).subscribe((res)=>{
      this._snackBar.open("added successfully...","" ,{duration:3000})
      this.clearControls()
    },(error=>{
      alert(error)
    }))
  }

  clearControls(){
    this.getRouteDays()
    this.routeDaysForm.reset()
    this.routeDaysForm.setErrors(null)
    Object.keys(this.routeDaysForm.controls).forEach(key=>{this.routeDaysForm.get(key)?.setErrors(null)})
  }

  pageSize = 10;
  currentPage = 1;
  totalItems = 0;
  filterValue = "";
  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getRouteDays();
  }

  days : RouteDays[] = [];
  daysSubscription!: Subscription
  getRouteDays(){
    this.daysSubscription = this.salesService.getPaginatedRouteDays(this.filterValue, this.currentPage, this.pageSize).subscribe((res: any)=>{
      this.filtered = res.items
      this.totalItems = res.count;
    })
  }

  detailSub!: Subscription;
  getComplete(){
    this.detailSub = this.salesService.getRouteDays().subscribe((res:any)=>{
      this.days = res;
    })
  }

  filtered!: any[];
  applyFilter(event: Event): void {
    if((event.target as HTMLInputElement).value.trim() === '') {
      this.getRouteDays();
    }else{
      const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
      this.filtered = this.days.filter(element =>
        element.route.routeName.toLowerCase().includes(filterValue)
        || element.id.toString().includes(filterValue)
        || element.weekDay.toLowerCase().includes(filterValue)
      );
    }
  }

  onToggleChange(event: any, id: number){

  }

  delete!: Subscription;
  deleteDays(id : any){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.delete = this.salesService.deleteRouteDays(id).subscribe((res)=>{
          this.getRouteDays()
          this._snackBar.open("Route Days deleted successfully...","" ,{duration:3000})
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
    const dialogRef = this.dialog.open(RouteDaysComponent, {
      data: { status: "true" , type : "edit", id: id},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getRoute();
    });
  }

  patchData(){
    this.isEdit = true;
    //Get the product based on the ID
    this.salesService.getRouteDayById(this.dialogData.id).subscribe((result) => {
      let day = result

      //Populate the object by the ID
      let routeId: any = day.routeId;
      let weekDays = day.weekDay.toString();
      console.log(day);

      this.routeDaysForm.patchValue({
        routeId : routeId,
        weekDays : weekDays
      })
      this.dayId = this.dialogData.id;
    })
  }

  edit!: Subscription
  editFunction(){
    if(!this.routeDaysForm.valid){
      return alert('Please fill the form first')
    }
    this.isEdit = false;

    let data: any ={
      routeId : this.routeDaysForm.get('routeId')?.value,
      weekDays : this.routeDaysForm.get('weekDays')?.value,
    }
    console.log(data);

    this.edit = this.salesService.updateRouteDays(this.dayId, data).subscribe((res)=>{
      this._snackBar.open("Route Days updated successfully...","" ,{duration:3000})
      this.clearControls();
    },(error=>{
          alert(error.message)
        }))
  }

  addArray(){
    let data ={
      days : this.routeDaysForm.getRawValue().weekDays,
      collectStatus : 'true'
    }

    this.dataSubmitted.emit(data);
    this.dialogRef.close(data);
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }
}


