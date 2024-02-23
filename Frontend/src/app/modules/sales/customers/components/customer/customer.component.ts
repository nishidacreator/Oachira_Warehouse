import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DeleteDialogueComponent } from 'src/app/modules/shared-components/delete-dialogue/delete-dialogue.component';
import { Customer } from '../../models/customer';
import { CustomerCategory } from '../../models/customer-category';
import { CustomerGrade } from '../../models/customer-grade';
import { CustomerCategoryComponent } from '../customer-category/customer-category.component';
import { CustomerGradeComponent } from '../customer-grade/customer-grade.component';
import { SalesService } from '../../../sales.service';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {

  branchId: number;
  constructor(private fb: FormBuilder,public salesService: SalesService, private _snackBar: MatSnackBar,
    public dialog: MatDialog, public router: Router, @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any,
    @Optional() public dialogRef: MatDialogRef<CustomerComponent>,){
      const token: any = localStorage.getItem('token')
      let user = JSON.parse(token)
      console.log(user)

      this.branchId = user.branch
    }

  ngOnDestroy(){
    this.customerSubscription?.unsubscribe()
    this.gradeSub.unsubscribe();
    this.categorySub.unsubscribe();
    // this.saleExec.unsubscribe();
    this.submit?.unsubscribe();
    this.delete?.unsubscribe();
    this.edit?.unsubscribe();
  }

  customerForm = this.fb.group({
    name: ['', Validators.required],
    customerCategoryId : ['', Validators.required],
    customerGradeId : ['', Validators.required],
    address1 : [''],
    address2 : [''],
    gstNo : [''],
    email : ['', Validators.email],
    remarks : [''],
    subledgerCode : [''],
    numbers : this.fb.array([])
  });

  numbers(): FormArray {
    return this.customerForm.get("numbers") as FormArray;
  }

  newNumber(): FormGroup {
    return this.fb.group({
      phoneNumber : ['', Validators.required]
    })
  }

  status: boolean = false;
  addNumber() {
    this.status = true;
    this.numbers().push(this.newNumber());
  }

  removeProduct(i: number) {
    this.numbers().removeAt(i);
  }

  displayedColumns : string[] = ['id','customerName', 'customerCategoryId','customerGradeId','phoneNumber','address','location','gstNo','email','remarks', 'manage']

  addStatus!: string
  ngOnInit(): void {
    this.getCategory()
    this.getGrade()
    this.getCustomers()
    this.salesExecutive()

    this.addNumber()
    if(this.dialogRef){
      this.addStatus = this.dialogData?.status;
      if(this.dialogData.type === 'edit'){
        this.patchData()
      }
      if(this.dialogData.category){
        this.getCategory(this.dialogData.category)
      }
    }
  }

  category: CustomerCategory[] = [];
  categorySub!: Subscription;
  getCategory(cat?: string){
    this.categorySub = this.salesService.getCustomerCategory().subscribe(c => {
      this.category = c
      if(cat){
        let id: any = this.category.find(c=>c.categoryName.toLowerCase() === cat.toLowerCase())?.id
        this.customerForm.get('customerCategoryId')?.setValue(id)
      }
    })
  }

  grade: CustomerGrade[] = [];
  gradeSub!: Subscription
  getGrade(){
    this.gradeSub = this.salesService.getCustomerGrade().subscribe(c => {
      this.grade = c
    })
  }

  submit!: Subscription;
  onSubmit(){
    if(!this.customerForm.valid){
      return alert('Please fill the form first')
    }
    let data = {
      name: this.customerForm.getRawValue().name,
      customerCategoryId : this.customerForm.getRawValue().customerCategoryId,
      customerGradeId : this.customerForm.getRawValue().customerGradeId,
      address1 : this.customerForm.getRawValue().address1,
      address2 : this.customerForm.getRawValue().address2,
      gstNo : this.customerForm.getRawValue().gstNo,
      email : this.customerForm.getRawValue().email,
      remarks : this.customerForm.getRawValue().remarks,
      numbers : this.customerForm.getRawValue().numbers,
      subledgerCode : this.customerForm.getRawValue().subledgerCode
    }

    this.submit = this.salesService.addCustomer(data).subscribe((res)=>{
      let data = {
        customer: this.customerForm.get('name')?.value
      }
      this.dialogRef?.close(data);
      this._snackBar.open("Customer added successfully...","" ,{duration:3000})
      this.clearControls()
    },(error=>{
      alert(error)
    }))
  }

  clearControls(){
    this.getCustomers()
    this.customerForm.reset()
  }

  customers : Customer[] = [];
  customerSubscription? : Subscription
  getCustomers(){
    this.customerSubscription = this.salesService.getCustomer().subscribe((res)=>{
      this.customers = res
      console.log(res);

      this.filtered = this.customers
    })
  }

  // openContacts(id: number){
  //   const dialogRef = this.dialog.open(ViewContactsComponent, {
  //     data: {id: id}
  //   });

  //   dialogRef.afterClosed().subscribe(result => {})
  // }

  filterValue: any;
  filtered!: any[];
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filterValue = filterValue;
    this.filtered = this.customers.filter(element =>
      element.name.toLowerCase().includes(filterValue)
      || element.id.toString().includes(filterValue)
      || element.customerCategory.categoryName.toLowerCase().includes(filterValue)
      || element.customerGrade.grade.toLowerCase().includes(filterValue)
      // || element.subledgerCode.toLowerCase().includes(filterValue)
      || element.address1.toLowerCase().includes(filterValue)
    );
  }

  delete!: Subscription;
  deleteBrand(id : any){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.delete = this.salesService.deleteCustomer(id).subscribe((res)=>{
          this.getCustomers()
          this._snackBar.open("Customer deleted successfully...","" ,{duration:3000})
        },(error=>{
          this._snackBar.open(error.error.message,"" ,{duration:3000})
        }))
      }
    })
  }

  isEdit = false;
  customerId : any;
  phoneNumbers!: any
  editCustomer(id: number) {
    const dialogRef = this.dialog.open(CustomerComponent, {
      data: { status: "true" , type : "edit", id: id},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getCustomers();
    });
  }

  patchData(){
    this.isEdit = true;
    this.salesService.getCustomer().subscribe((result) => {
      let customer = result.find(x=>x.id === this.dialogData.id)
      console.log(customer);

      this.customerId = this.dialogData.id

      let name = customer?.name.toString();
      let customerCategoryId: any = customer?.customerCategoryId;
      let customerGradeId: any = customer?.customerGradeId;
      let address1 = customer?.address1?.toString();
      let address2 = customer?.address2?.toString();
      let gstNo = customer?.gstNo.toString();
      let email = customer?.email.toString();
      let remarks = customer?.remarks.toString();
      let subledgerCode = customer?.subledgerCode.toString();

      this.customerForm.patchValue({
        name : name,
        customerCategoryId : customerCategoryId,
        customerGradeId : customerGradeId,
        address1 : address1,
        address2 : address2,
        gstNo : gstNo,
        // email : email,
        remarks : remarks,
        subledgerCode : subledgerCode
      })

      const numbers = this.customerForm.get("numbers") as FormArray;
      numbers.clear();

        let contacts = customer?.customerPhones;
        if (contacts && contacts.length > 0) {
          contacts.forEach((detail: any) => {
            console.log(detail);

          const details = this.fb.group({
            phoneNumber : detail.phoneNumber,
          });

          numbers.push(details);
          })
        }
    })
  }

  edit!: Subscription;
  editFunction(){
    if(!this.customerForm.valid){
      return alert('Please fill the form first')
    }
    this.isEdit = false;

    let data: any ={
      customerName : this.customerForm.get('customerName')?.value,
      customerCategoryId : this.customerForm.get('customerCategoryId')?.value,
      customerGradeId : this.customerForm.get('customerGradeId')?.value,
      subledgerCode : this.customerForm.get('subledgerCode')?.value,
      address : this.customerForm.get('address')?.value,
      location : this.customerForm.get('location')?.value,
      gstNo : this.customerForm.get('gstNo')?.value,
      email : this.customerForm.get('email')?.value,
      remarks : this.customerForm.get('remarks')?.value,
      numbers : this.customerForm.getRawValue().numbers,
    }
    console.log(data);

    this.edit = this.salesService.updateCustomer(this.customerId, data).subscribe((res)=>{

      this._snackBar.open("Customer updated successfully...","" ,{duration:3000})
      this.clearControls();
    },(error=>{
          alert(error.message)
        }))
  }

  addCategory(){
    const dialogRef = this.dialog.open(CustomerCategoryComponent, {
      data: {status : 'true'}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getCategory()
    })
  }

  addGrade(){
    const dialogRef = this.dialog.open(CustomerGradeComponent, {
      data: {status : 'true'}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getGrade()
    })
  }

  id : any;
  saleExec!: Subscription;
  salesExecutive(){
    //SALES EXECUTIVE
    const token: any = localStorage.getItem('token')
    let user = JSON.parse(token)
    this.id = user.role

    // this.saleExec = this.salesService.getRoleById(this.id).subscribe((res)=>{
    //   let role = res.roleName.toLowerCase();

    //   if(role === 'salesexecutive'){
    //     let id: any = this.category.find(c => c.categoryName.toLowerCase() === 'route')?.id

    //     this.customerForm.patchValue({
    //         customerCategoryId : id
    //       })
    //   }
    // })
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }
}

