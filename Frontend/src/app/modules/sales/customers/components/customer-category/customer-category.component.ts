import { Component, Inject, OnInit, Optional } from '@angular/core';
import { Subscription } from 'rxjs';
import { SalesService } from '../../../sales.service';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeleteDialogueComponent } from 'src/app/modules/shared-components/delete-dialogue/delete-dialogue.component';
import { CustomerCategory } from '../../models/customer-category';

@Component({
  selector: 'app-customer-category',
  templateUrl: './customer-category.component.html',
  styleUrls: ['./customer-category.component.scss']
})
export class CustomerCategoryComponent implements OnInit {

  constructor(private fb: FormBuilder,public salesService: SalesService, private _snackBar: MatSnackBar,
    public dialog: MatDialog, @Optional() public dialogRef: MatDialogRef<CustomerCategoryComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any){}

  ngOnDestroy(){
    this.categorySubscription?.unsubscribe()
    if(this.submit){
      this.submit.unsubscribe()
    }
    if(this.edit){
      this.edit.unsubscribe()
    }
    if(this.delete){
      this.delete.unsubscribe()
    }
  }

  customerCategoryForm = this.fb.group({

    categoryName: ['', Validators.required]
  });

  displayedColumns : string[] = ['id','categoryName', 'manage']

  addStatus!: string
  ngOnInit(): void {
    this.getCategory()

    if (this.dialogRef) {
      this.addStatus = this.dialogData?.status;
      this.patchData()
    }
  }


  submit!: Subscription;
  onSubmit(){
    if(!this.customerCategoryForm.valid){
      return alert('Please fill the form first')
    }
    this.submit = this.salesService.addCustomerCategory(this.customerCategoryForm.getRawValue()).subscribe((res)=>{
      this._snackBar.open("Customer category added successfully...","" ,{duration:3000})
      this.clearControls()
    },(error=>{
      alert(error)
    }))
  }

  clearControls(){
    this.getCategory()
    this.customerCategoryForm.reset()
    this.customerCategoryForm.setErrors(null)
    Object.keys(this.customerCategoryForm.controls).forEach(key=>{this.customerCategoryForm.get(key)?.setErrors(null)})
  }

  category: CustomerCategory[] = [];
  categorySubscription? : Subscription;
  getCategory(){
    this.categorySubscription = this.salesService.getCustomerCategory().subscribe((res)=>{
      this.category = res
      console.log(this.category);

    })
  }

  delete!: Subscription;
  deleteBrand(id : any){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.delete = this.salesService.deleteCustomerCategory(id).subscribe((res)=>{
          this.getCategory()
          this._snackBar.open("Category deleted successfully...","" ,{duration:3000})
        },(error=>{
          this._snackBar.open(error.error.message,"" ,{duration:3000})
        }))
      }
    })
  }

  isEdit = false;
  catId : any;
  edit!: Subscription;
  editCategory(id : any){
    const dialogRef = this.dialog.open(CustomerCategoryComponent, {
      data: { status: "true" , type : "edit", id: id},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getCategory();
    });
  }

  editFunction(){
    if(!this.customerCategoryForm.valid){
      return alert('Please fill the form first')
    }
    this.isEdit = false;

    let data: any ={
      categoryName : this.customerCategoryForm.get('categoryName')?.value
    }

    this.edit = this.salesService.updateCustomerCategory(this.catId, data).subscribe((res)=>{
      this._snackBar.open("Category updated successfully...","" ,{duration:3000})
      this.clearControls();
      this.dialogRef?.close();
    },(error=>{
          alert(error.message)
        }))
  }


  patchData(){
    this.isEdit = true;
    this.salesService.getCustomerCategory().subscribe(res=>{
      if(this.dialogData?.type === 'edit'){
        // this.editstatus = true
        let cat: any= res.find(x =>x.id == this.dialogData?.id)
        console.log(cat)

        let categoryName = cat.categoryName;
        let status = cat.status;

        this.customerCategoryForm.patchValue({
          categoryName : categoryName,
          // status : status,
        })
        this.catId = this.dialogData?.id;
      }
    })
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
