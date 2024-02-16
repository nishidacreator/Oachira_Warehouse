import { Component, Inject, OnDestroy, OnInit, Optional } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SalesService } from '../../../sales.service';
import { Subscription } from 'rxjs';
import { Customer } from '../../../customers/models/customer';
import { Route } from '../../models/route';
import { RouteDetails } from '../../models/route-details';
import { PageEvent } from '@angular/material/paginator';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerComponent } from '../../../customers/components/customer/customer.component';
import { RouteComponent } from '../route/route.component';
import { DeleteDialogueComponent } from 'src/app/modules/shared-components/delete-dialogue/delete-dialogue.component';

@Component({
  selector: 'app-route-details',
  templateUrl: './route-details.component.html',
  styleUrls: ['./route-details.component.scss']
})
export class RouteDetailsComponent implements OnInit, OnDestroy {

  constructor(private fb: FormBuilder, private salesService: SalesService, private dialog: MatDialog,private _snackBar: MatSnackBar,
    @Optional() public dialogRef: MatDialogRef<RouteDetailsComponent>, @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any) { }

  ngOnDestroy(): void {
    this.customerSub?.unsubscribe();
    this.routeSub?.unsubscribe();
    this.routeDetailSub?.unsubscribe();
    this.submit?.unsubscribe();
    this.edit?.unsubscribe();
    this.delete?.unsubscribe();
    this.rdSub?.unsubscribe();
    this.detailSub?.unsubscribe();
  }

  routeDetailsForm = this.fb.group({
    routeId : ['', Validators.required],
    customerId : ['', Validators.required],
    routeIndex : []
  });

  addStatus!: string;
  editstatus!: boolean;
  ngOnInit(): void {
    this.getCustomer()
    this.getRoute()
    this.getRouteDetails()
    this.getComplete()

    if (this.dialogRef) {
      this.addStatus = this.dialogData?.status;
      if(this.dialogData?.type === 'edit'){
        this.patchData()
      }
    }
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

  routeSub!: Subscription;
  routes: Route[] = [];
  getRoute(value?: string){
    this.routeSub = this.salesService.getRoute().subscribe(route => {
      this.routes = route;
      this.filteredRoute = route;
      if(value){
        this.filterRoute(value);
      }
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

  addRoute(){
    const dialogRef = this.dialog.open(RouteComponent, {
      data: { status: "true"},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getRoute(result?.route);
    });
  }

  submit!: Subscription;
  onSubmit(){
    if(!this.routeDetailsForm.valid){
      return alert('Please fill the form first')
    }
    this.submit = this.salesService.addRouteDetails(this.routeDetailsForm.getRawValue()).subscribe(route => {
      this.clearControls();
      this._snackBar.open("Route Details added successfully...","" ,{duration:3000})
          this.dialogRef?.close();
        },(error=>{
              alert(error.message)
        }))
  }

  clearControls(){
    this.getRouteDetails()
    this.routeDetailsForm.reset()
  }

  routeDetails: RouteDetails[] = [];
  routeDetailSub!: Subscription;
  getRouteDetails(){
    this.routeDetailSub = this.salesService.getPaginatedRouteDetails(this.filterValue, this.currentPage, this.pageSize).subscribe((res: any)=>{
      this.filtered = res.items
      this.totalItems = res.count;
    })
  }

  detailSub!: Subscription;
  getComplete(){
    this.detailSub = this.salesService.getRouteDetails().subscribe((res:any)=>{
      this.routeDetails = res;
    })
  }

  filtered!: any[];
  applyFilter(event: Event): void {
    if((event.target as HTMLInputElement).value.trim() === '') {
      this.getRouteDetails();
    }else{
      const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();

      this.filtered = this.routeDetails.filter(element =>
        element.route.routeName.toLowerCase().includes(filterValue)
        || element.id.toString().includes(filterValue)
        || element.status.toString().includes(filterValue)
        || element.customer.name.toLowerCase().includes(filterValue)
      );
    }
  }

  isEdit: boolean = false;
  editDetails(id: number){
    const dialogRef = this.dialog.open(RouteDetailsComponent, {
      data: { status: "true" , type : "edit", id: id},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getRouteDetails();
    });
  }

  routeId!: number;
  rdSub!: Subscription;
  patchData(){
    this.rdSub = this.salesService.getRouteDetailsById(this.dialogData?.id).subscribe(res=>{
      this.editstatus = true
      let route = res
      console.log(route)

      let routeName: any = route.route.id
      let customer: any = route.customer.id
      let index: any = route.routeIndex

      this.routeDetailsForm.patchValue({
        routeId : routeName,
        customerId : customer,
        routeIndex : index
      })
      this.routeId = this.dialogData?.id;
    })
  }

  edit!: Subscription;
  editFunction(){
    if(!this.routeDetailsForm.valid){
      return alert('Please fill the form first')
    }
    let data = {
      routeId : this.routeDetailsForm.get('routeId')?.value,
      customerId : this.routeDetailsForm.get('customerId')?.value,
      routeIndex : this.routeDetailsForm.get('routeIndex')?.value
    }
    this.edit = this.salesService.updateRouteDetails(this.routeId, data).subscribe(data=>{
      this._snackBar.open("Route Details updated successfully...","" ,{duration:3000})
      this.dialogRef?.close();
      this.clearControls();
    },(error=>{
          alert(error.message)
    }))
  }

  onCancelClick(){
    this.dialogRef.close();
  }

  delete!: Subscription;
  deleteDetails(id: number){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.delete = this.salesService.deleteRouteDetails(id).subscribe((res)=>{
          this.getRouteDetails()
          this._snackBar.open("RouteDetails deleted successfully...","" ,{duration:3000})
        },(error=>{
          this._snackBar.open(error.error.message,"" ,{duration:3000})
        }))
      }
    })
  }

  onToggleChange(event: any, id: number) {
    const newValue = event.checked;

    let data = {
      status : newValue
    }
    this.salesService.updateRouteDetailStatus(id, data).subscribe(data=>{
      this._snackBar.open("Status updated successfully...","" ,{duration:3000})
    });
  }

  pageSize = 10;
  currentPage = 1;
  totalItems = 0;
  filterValue = "";
  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getRouteDetails();
  }
}
