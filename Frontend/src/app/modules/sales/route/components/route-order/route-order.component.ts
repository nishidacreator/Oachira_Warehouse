import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductComponent } from 'src/app/modules/products/components/product/product.component';
import { UnitComponent } from 'src/app/modules/products/components/unit/unit.component';
import { Product } from 'src/app/modules/products/models/product';
import { SecondaryUnit } from 'src/app/modules/products/models/secondary-unit';
import { ProductService } from 'src/app/modules/products/product.service';
import { UsersService } from 'src/app/modules/users/users.service';
import { CustomerComponent } from '../../../customers/components/customer/customer.component';
import { Customer } from '../../../customers/models/customer';
import { SalesService } from '../../../sales.service';
import { TripDays } from '../../models/trip-days';
import { RouteComponent } from '../route/route.component';
import { Route } from '../../models/route';

@Component({
  selector: 'app-route-order',
  templateUrl: './route-order.component.html',
  styleUrls: ['./route-order.component.scss']
})
export class RouteOrderComponent implements OnInit {

  constructor(private fb: FormBuilder, private salesService: SalesService, private dialog: MatDialog,
    private productService: ProductService, private userService: UsersService, private _snackBar: MatSnackBar,
    @Optional() public dialogRef: MatDialogRef<RouteOrderComponent>, private route: ActivatedRoute,
    @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any
    ) { }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
    this.customerSub?.unsubscribe();
    this.productSub?.unsubscribe();
    this.unitSub?.unsubscribe();
  }

  routeOrderForm = this.fb.group({
    routeId: ['', Validators.required],
    customerId: ['', Validators.required],
    deliveryDate: ['', Validators.required],
    products : this.fb.array([]),
    salesExecutiveId : [0]
  });

  userId!: number;
  ngOnInit(): void {
    this.getRoute();
    this.getCustomer();
    this.getAllRouteProducts();
    this.getUnit();
    this.addProduct();
    this.getDeliveryDays();

    const token: any = localStorage.getItem('token')
    let user = JSON.parse(token)
    console.log(user);
    this.userId = user.id

    this.userService.getRoleById(user.role).subscribe(role=>{
      if(role.roleName.toLowerCase() === 'admin'){
        this.getRoute()
      }else{
        this.getRoute('', this.userId)
      }
    });

    let id = this.route.snapshot.params['id'];
    if(id){
      this.patchData(id)
    }
  }

  routes: Route[] = [];
  routeSub!: Subscription
  getRoute(value?: string, userId?: number){
    if(userId){
      this.routeSub = this.salesService.getRouteByUserId(userId).subscribe(route =>{
        this.routes = route
        this.filteredRoute = route
      });
    }else{
      this.routeSub = this.salesService.getRoute().subscribe(route =>{
        this.routes = route
        this.filteredRoute = route
        if(value){
          this.filterRoute(value)
        }
      });
    }
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

  customers: Customer[] = [];
  customerSub!: Subscription;
  getCustomer(value?: string){
    this.customerSub = this.salesService.getCustomer().subscribe(res=>{
      this.customers = res;
      this.filteredCustomer = res;
      if(value){
        this.filterCustomer(value)
      }
    })
  }

  addCustomer(){
    const dialogRef = this.dialog.open(CustomerComponent, {
      data: { status: "true", category: "Route"},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getCustomer(result?.customer);
    });
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

  getCustomerByRoute(id: any){
    console.log(id);

    if(id!='add'){
      this.salesService.getRouteDetailsByRouteId(id).subscribe(data=>{
        this.filteredCustomer = data.map(x=> x.customer)
        this.salesService.getTripDayByRouteId(id).subscribe(x =>{
          console.log(x);
          this.weekDay = x.map(x=> x.weekDay);
        });
      });
    }
  }

  days : TripDays[] = [];
  daysSubscription? : Subscription
  weekDay: any[] = [];
  getDeliveryDays(){
    this.daysSubscription = this.salesService.getTripDays().subscribe((res)=>{
      this.days = res
      console.log(this.days);

      for(let i = 0; i < this.days.length; i++){
        this.weekDay[i] = this.days[i].weekDay
      }
    })
  }

  weekdayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    const weekdayName = this.weekdayNames[day];
    return this.weekDay.includes(weekdayName);
  };

  products() : FormArray {
    return this.routeOrderForm.get("products") as FormArray
  }

  newProduct(): FormGroup {
    return this.fb.group({
      productId: ['', Validators.required],
      quantity: ['', Validators.required],
      secondaryUnitId: ['']
    })
  }

  addProduct() {
    this.products().push(this.newProduct());
  }

  removeProduct(i:number) {
    this.products().removeAt(i);
  }

  product: Product[] = [];
  productSub!: Subscription;
  getAllRouteProducts(value?: string){
    this.productSub = this.productService.getAllRouteProducts().subscribe(res=>{
      this.product = res;
      this.filteredProduct = res;
    })
  }

  addProducts(){
    const dialogRef = this.dialog.open(ProductComponent, {
      data: { status: "true"},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getAllRouteProducts(result?.route);
    });
  }

  filteredProduct: Product[] = [];
  filterProduct(event: Event | string) {
    let value: string = "";

    if (typeof event === "string") {
      value = event;
    } else if (event instanceof Event) {
      value = (event.target as HTMLInputElement).value;
    }
    this.filteredProduct = this.product.filter((option) => {
      if (
        (option.productName &&
          option.productName.toLowerCase().includes(value?.toLowerCase()))
      ) {
        return true;
      } else {
        return null;
      }
    });
  }

  units: SecondaryUnit[] = [];
  unitSub!: Subscription;
  getUnit(value?:string){
    this.unitSub = this.productService.getSecondaryUnit().subscribe(unit=>{
      this.units = unit;
      this.filteredUnit = unit;
      if(value){
        this.filterUnit(value);
      }
    });
  }

  addUnit(){
    const dialogRef = this.dialog.open(UnitComponent, {
      data: { status: "add", type : "add", unit: "secondary" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getUnit(result?.unit);
    });
  }

  filteredUnit: SecondaryUnit[] = [];
  filterUnit(event: Event | string) {
    let value: string = "";

    if (typeof event === "string") {
      value = event;
    } else if (event instanceof Event) {
      value = (event.target as HTMLInputElement).value;
    }
    this.filteredUnit = this.units.filter((option) => {
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

  onSubmit(){
    if(!this.routeOrderForm.valid){
      return alert("Please fill the form completely")
    }
    let data = {
      ...this.routeOrderForm.value
    }
    data.salesExecutiveId = this.userId
    this.salesService.addRouteOrder(data).subscribe(res=>{
      console.log(res);
      let data = {
        route: this.routeOrderForm.get('routeName')?.value
      }
      this.dialogRef?.close(data);
      if(!this.dialogRef){
        history.back();
      }
      this._snackBar.open("RouteOrder added successfully...","" ,{duration:3000})
      this.clearControls()
    });
  }

  clearControls(){
    this.routeOrderForm.reset()
  }

  isEdit: boolean = false;
  plId!: number;
  patchData(id: number){
    this.isEdit = true;
    this.salesService.getRouteOrderById(id).subscribe(data =>{
      let list = data
      console.log(list);

      this.plId = list.id;
      let route: any = list.route.id;
      let customer: any = list.customer.id;
      let delivery: any = list.deliveryDate;

      this.routeOrderForm.patchValue({
        routeId: route,
        customerId: customer,
        deliveryDate: delivery
      })

      const pl = this.routeOrderForm.get("products") as FormArray;
        pl.clear();
        let products = list.routeSODetails;
        if (products && products.length > 0) {
          products.forEach((detail: any) => {
            console.log(detail);

          const details = this.fb.group({
            productId : detail.productId,
            quantity : detail.quantity,
            secondaryUnitId : detail.secondaryUnitId
          });

          pl.push(details);
        })
      }
    });
  }

  edit!: Subscription;
  editFunction(){
    if(!this.routeOrderForm.valid){
      return alert('Please fill the form first')
    }
    this.isEdit = false;

    let data: any ={
      routeId : this.routeOrderForm.get('routeId')?.value,
      customerId : this.routeOrderForm.get('customerId')?.value,
      salesExecutiveId : this.userId,
      deliveryDate : this.routeOrderForm.get('deliveryDate')?.value,
      products : this.routeOrderForm.get('products')?.value
    }

    this.edit = this.salesService.updateRouteOrder(this.plId, data).subscribe((res)=>{
      history.back();

      this._snackBar.open("RouteOrder updated successfully...","" ,{duration:3000})
      this.clearControls();
    },(error=>{
          alert(error.message)
        }))
  }

}
