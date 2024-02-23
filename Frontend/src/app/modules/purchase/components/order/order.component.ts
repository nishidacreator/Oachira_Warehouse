import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PurchaseService } from '../../purchase.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductComponent } from 'src/app/modules/products/components/product/product.component';
import { UnitComponent } from 'src/app/modules/products/components/unit/unit.component';
import { Product } from 'src/app/modules/products/models/product';
import { SecondaryUnit } from 'src/app/modules/products/models/secondary-unit';
import { ProductService } from 'src/app/modules/products/product.service';

import { UsersComponent } from 'src/app/modules/users/components/users/users.component';
import { User } from 'src/app/modules/users/models/user';
import { UsersService } from 'src/app/modules/users/users.service';
import { DistributorComponent } from 'src/app/modules/products/components/distributor/distributor.component';
import { Distributor } from 'src/app/modules/products/models/distributor';
import { CompanyService } from 'src/app/modules/company/company.service';
import { company } from 'src/app/modules/company/models/company';
import { CompanyComponent } from 'src/app/modules/company/components/company/company.component';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit, OnDestroy {

  constructor(private fb: FormBuilder, public purchaseService: PurchaseService, public dialog: MatDialog,
    private router: Router, private route: ActivatedRoute, private companyService: CompanyService,
    private userService: UsersService, private productService: ProductService) {
    //User
    const token: any = localStorage.getItem("token");
    let user = JSON.parse(token);
    this.id = user.id;
  }

  ngOnDestroy() {
    // this.warehouseSub?.unsubscribe();
    this.userSub?.unsubscribe();
    this.productSub?.unsubscribe();
    this.unitSub?.unsubscribe();
  }

  id!: number;
  addStatus!: string;
  editstatus!: boolean;
  ngOnInit(): void {
    this.getCompany()
    this.getDistributor();
    this.getUsers();
    this.getProduct();
    this.getSecondaryUnit();
    this.generateInvoiceNumber();
    this.addProduct();
    let orderId = this.route.snapshot.params['id'];
    if(orderId){
      this.patchData(orderId)
    }
  }

  purchaseOrderForm = this.fb.group({
    orderNo: ["", Validators.required],
    companyId: [Validators.required],
    userId: [],
    date: ["", Validators.required],
    distributorId:[],
    orderDetails: this.fb.array([]),
  });

  products(): FormArray {
    return this.purchaseOrderForm.get("orderDetails") as FormArray;
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

  // warehouseSub!: Subscription;
  // warehouse: Warehouse[] = [];
  // getWarehouse(value?: string) {
  //   this.warehouseSub = this.storeService.getWarehouse().subscribe((store) => {
  //     this.warehouse = store;
  //     this.filteredWarehouse = store;

  //     if(value){
  //       this.filterWarehouse(value);
  //     }
  //   })
  // }

  // addWarehouse(){
  //   const dialogRef = this.dialog.open(WarehouseComponent, {
  //     data: { status: "true"},
  //   });

    // dialogRef.afterClosed().subscribe((result) => {
    //   // this.getWarehouse(result?.store);
    // });


  // filteredWarehouse: Warehouse[] = [];
  // filterWarehouse(event: Event | string) {
  //   let value: string = "";

  //   if (typeof event === "string") {
  //     value = event;
  //   } else if (event instanceof Event) {
  //     value = (event.target as HTMLInputElement).value;
  //   }
  //   this.filteredWarehouse = this.warehouse.filter((option) => {
  //     if (
  //       (option.warehouseName &&
  //         option.warehouseName.toLowerCase().includes(value?.toLowerCase()))
  //     ) {
  //       return true;
  //     } else {
  //       return null;
  //     }
  //   });
  // }

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
      this.getUsers(result?.user);
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

  addNewProduct(){
    const dialogRef = this.dialog.open(ProductComponent, {
      data: { status: "true"},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getProduct(result?.product);
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

  addSecondaryUnit(){
    const dialogRef = this.dialog.open(UnitComponent, {
      data: { status: "add", unit: "secondary"},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getSecondaryUnit(result?.unit);
    });
  }

  ivNum: string = "";
  nextId!: any;
  prefix!: string;
  prSub!: Subscription;
  generateInvoiceNumber() {
    this.prSub = this.userSub = this.purchaseService.getPO().subscribe((res) => {
      let purchases = res;

      // Check if there are any employees in the array
      if (purchases.length > 0) {
        const maxId = purchases.reduce((prevMax, inv) => {
          console.log(inv);
          // Extract the numeric part of the employee ID and convert it to a number
          const idNumber = parseInt(inv.orderNo.substring(5), 10);
          console.log(idNumber);

          this.prefix = this.extractLetters(inv.orderNo);

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
        this.nextId = 0o1;
        this.prefix = "PO#";
      }

      const paddedId = `${this.prefix}${this.nextId
        .toString()
        .padStart(3, "0")}`;

      this.ivNum = paddedId;

      this.purchaseOrderForm.get("orderNo")?.setValue(this.ivNum);
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
    // if(!this.purchaseOrderForm.valid){
    //   return alert('Please fill the form first')
    // }
    let data = this.purchaseOrderForm.getRawValue()
    console.log('dta',data);

    this.submitSub = this.purchaseService.addPO(data).subscribe((res) =>{
      console.log('API Response:', res);
      history.back()
      this.clearControls()
    },
    (error) => {
      alert(error);
    })
  }

  clearControls() {
    this.purchaseOrderForm.reset();
    // this.router.navigateByUrl("/login/purachases/viewpurchaserequest");
  }


  distributorSub!: Subscription;
  distributors: Distributor[] = [];
  getDistributor(value?: string){
    this.distributorSub = this.productService.getDistributor().subscribe(distributor =>{
      this.distributors = distributor
      this.filteredDistributor = distributor;
      if(value){
        this.filterDistributor(value)
      }
    });
  }

  company :company[]=[]
  getCompany(){
   this.companyService.getCompanies().subscribe((res)=>{
    this.company = res;
   })

  }

  filteredDistributor: Distributor[] = [];
  filterDistributor(event: any){
    let value: string = "";

    if (typeof event === "string") {
      value = event;
    } else if (event instanceof Event) {
      value = (event.target as HTMLInputElement).value;
    }
    this.filteredDistributor = this.distributors.filter((option) => {
      if (
        (option.distributorName &&
          option.distributorName.toLowerCase().includes(value?.toLowerCase()))
      ) {
        return true;
      } else {
        return null;
      }
    });
  }

  addDistributor(){
    const dialogRef = this.dialog.open(DistributorComponent, {
      data: { status: "true", type: "add"},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getDistributor(result?.distributor);
    });
  }

  poId!: number;
  patchData(id: number){
    this.purchaseService.getPOById(id).subscribe(res=>{
      this.poId = id;
        this.editstatus = true
        let po = res




        console.log("GET API BY ID " , po)


        let orderNo : any = po.orderNo
        let companyId: any = po.companyId;
        let date: any = po.date;
        let distributorId : any = po.distributorId;



        this.purchaseOrderForm.patchValue({
          orderNo : orderNo,
          companyId : companyId,
          date : date,
          distributorId : distributorId
        })

        const pd = this.purchaseOrderForm.get("orderDetails") as FormArray;
        pd.clear();
        let rDetails = res.orderDetails;
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
    this.purchaseService.updatePO(this.poId, this.purchaseOrderForm.getRawValue()).subscribe((res)=>{
      this.clearControls()
      history.back()
    })
  }
  addCompany(){
    const dialogRef = this.dialog.open(CompanyComponent, {
      // data: { status: "true", type: "add"},
    });

    dialogRef.afterClosed().subscribe((result) => {
      // this.getDistributor(result?.distributor);
    });
  }
  }

