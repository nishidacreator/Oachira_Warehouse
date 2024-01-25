import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormArray, FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { PurchaseService } from '../../purchase.service';
import { StoreService } from 'src/app/modules/store/store.service';
import { Subscription } from 'rxjs';
import { Store } from 'src/app/modules/store/models/store';
import { UsersService } from 'src/app/modules/users/users.service';
import { User } from 'src/app/modules/users/models/user';
import { ProductService } from 'src/app/modules/products/product.service';
import { Product } from 'src/app/modules/products/models/product';
import { SecondaryUnit } from 'src/app/modules/products/models/secondary-unit';
import { StoreComponent } from 'src/app/modules/store/components/store/store.component';
import { UnitComponent } from 'src/app/modules/products/components/unit/unit.component';
import { UsersComponent } from 'src/app/modules/users/components/users/users.component';
import { ProductComponent } from 'src/app/modules/products/components/product/product.component';
import * as moment from 'moment';
@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss']
})
export class RequestComponent implements OnInit {

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
  ngOnInit(): void {
    this.getStores();
    this.getUsers();
    this.getProduct();
    this.getSecondaryUnit();
    this.generateInvoiceNumber();
    this.addProduct();
    let requestId = this.route.snapshot.params['id'];
    if(requestId){
      this.patchData(requestId)
    }
  }

  purchaseRequestForm = this.fb.group({
    requestNo: ["", Validators.required],
    storeId: [Validators.required],
    userId: [],
    date: ["", Validators.required],
    requestDetails: this.fb.array([]),
  });

  products(): FormArray {
    return this.purchaseRequestForm.get("requestDetails") as FormArray;
  }

  newProduct(initialValue?: any): FormGroup {
    return this.fb.group({
      productId: [
        initialValue ? initialValue.productId : "",
        Validators.required,
      ],
      quantity: [
        initialValue ? initialValue.quantity : null,
        Validators.required,
      ],
      secondaryUnitId: [
        initialValue ? initialValue.quantity : null,
      ]
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

      this.purchaseRequestForm.get('storeId')?.setValue(result.store.id);
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

        this.purchaseRequestForm.get('userId')?.setValue(result.user.id);
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

      this.purchaseRequestForm.get("requestNo")?.setValue(this.ivNum);
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
    if(this.purchaseRequestForm.valid){
      let form = {
        ...this.purchaseRequestForm.value
      }
      form.date = moment(this.purchaseRequestForm.value.date).format('YYYY-MM-DD HH:mm:ss');

      this.submitSub = this.purchaseService.addPR(form).subscribe(() =>{
        this.clearControls()
      },
      (error) => {
        alert(error);
      })
    }
  }

  clearControls() {
    this.purchaseRequestForm.reset();
    this.router.navigateByUrl("/login/purachases/viewpurchaserequest");
  }

  prId!: number;
  patchData(id: number){
    this.purchaseService.getPRById(id).subscribe(res=>{
      this.prId = id;
        this.editstatus = true
        let pr = res

        let requestNo = pr.requestNo.toString();
        let store: any = pr.storeId;
        let user: any = pr.userId;
        let date: any = pr.date;

        this.purchaseRequestForm.patchValue({
          requestNo : requestNo,
          storeId : store,
          userId : user,
          date : date
        })

        const pd = this.purchaseRequestForm.get("requestDetails") as FormArray;
        pd.clear();
        let rDetails = res.requestDetails;
        if (rDetails && rDetails.length > 0) {
          rDetails.forEach((detail: any) => {
            console.log(detail);

          const details = this.fb.group({
            productId : detail.productId,
            quantity : detail.quantity,
            secondaryUnitId : detail.secondaryUnitId
          });

          pd.push(details);
        });
      }
    })
  }

  update(){
    this.purchaseService.updatePR(this.prId, this.purchaseRequestForm.getRawValue()).subscribe((res)=>{
      this.clearControls()
    })
  }
}
