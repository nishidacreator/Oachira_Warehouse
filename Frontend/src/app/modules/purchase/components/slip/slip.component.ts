import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { UnitComponent } from 'src/app/modules/products/components/unit/unit.component';
import { PrimaryUnit } from 'src/app/modules/products/models/primary-unit';
import { SecondaryUnit } from 'src/app/modules/products/models/secondary-unit';
import { ProductService } from 'src/app/modules/products/product.service';
import { CustomerGradeComponent } from 'src/app/modules/sales/customers/components/customer-grade/customer-grade.component';
import { CustomerGrade } from 'src/app/modules/sales/customers/models/customer-grade';
import { SalesService } from 'src/app/modules/sales/sales.service';
import { DeleteDialogueComponent } from 'src/app/modules/shared-components/delete-dialogue/delete-dialogue.component';
import { PurchaseService } from '../../purchase.service';

@Component({
  selector: 'app-slip',
  templateUrl: './slip.component.html',
  styleUrls: ['./slip.component.scss']
})
export class SlipComponent implements OnInit {

  constructor(private fb: FormBuilder,public purchaseService: PurchaseService, private _snackBar: MatSnackBar,
    public dialog: MatDialog, @Optional() public dialogRef: MatDialogRef<CustomerGradeComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any){}

  ngOnDestroy() {
    // this.gradeSubscription?.unsubscribe()
    if(this.submit){
      this.submit.unsubscribe();
    }
    // if(this.edit){
    //   this.edit.unsubscribe();
    // }
    // if(this.delete){
    //   this.delete.unsubscribe();
    // }
  }

  slipForm = this.fb.group({
    date: [ ],
    invoiceNo : [],
    amount:[],
    description : [''],
    contactPerson : [,]
  });

  displayedColumns : string[] = ['id','grade', 'gradeRemarks', 'manage']

  addStatus!: string
  ngOnInit(): void {
    // this.getGrade()

    if (this.dialogRef) {
      this.addStatus = this.dialogData?.status;
      // this.patchData()
    }
  }

  submit!: Subscription
  onSubmit(){
    if(!this.slipForm.valid){
      return alert('Please fill the form first')
    }

    let data = {
      date: this.slipForm.get("slip")?.value,
      description : this.slipForm.get("description")?.value,
      contactPerson : this.slipForm.get("contactPerson")?.value,
      status:"open"

    }
    this.submit = this.purchaseService.addSlip(data).subscribe((res)=>{
      this._snackBar.open("Slip  added successfully...","" ,{duration:3000})
      this.clearControls()
    },(error=>{
      alert(error)
    }))
  }

  clearControls(){
    // this.getGrade()
    this.slipForm.reset()
    this.slipForm.setErrors(null)
    Object.keys(this.slipForm.controls).forEach(key=>{this.slipForm.get(key)?.setErrors(null)})
  }

  // grades: CustomerGrade[] = [];
  // gradeSubscription? : Subscription;
  // getGrade(){
  //   this.gradeSubscription = this.salesService.getCustomerGrade().subscribe((res)=>{
  //     this.grades = res
  //   })
  // }

  // delete!: Subscription;
  // deleteBrand(id : any){
  //   const dialogRef = this.dialog.open(DeleteDialogueComponent, {
  //     data: {}
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result === true) {
  //       this.delete = this.salesService.deleteCustomerGrade(id).subscribe((res)=>{
  //         this.getGrade()
  //         this._snackBar.open("Grade deleted successfully...","" ,{duration:3000})
  //       },(error=>{
  //         this._snackBar.open(error.error.message,"" ,{duration:3000})
  //       }))
  //     }
  //   })
  // }

  isEdit = false;
  gradeId : any;
  // editBrand(id : any){
  //   const dialogRef = this.dialog.open(CustomerGradeComponent, {
  //     data: { status: "true" , type : "edit", id: id},
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {
  //     this.getGrade();
  //   });
  // }

  // patchData(){
  //   this.isEdit = true;
  //   this.salesService.getCustomerGrade().subscribe(res=>{
  //     if(this.dialogData?.type === 'edit'){
  //       // this.editstatus = true
  //       let grad: any= res.find(x =>x.id == this.dialogData?.id)
  //       console.log(grad)

  //       let grade = grad.grade;
  //       let gradeRemarks = grad.gradeRemarks;

  //       this.slipForm.patchValue({
  //         grade : grade,
  //         gradeRemarks: gradeRemarks
  //         // status : status,
  //       })
  //       this.gradeId = this.dialogData?.id;
  //     }
  //   })
  // }

  // edit!: Subscription;
  // editFunction(){
  //   if(!this.slipForm.valid){
  //     return alert('Please fill the form first')
  //   }
  //   this.isEdit = false;

  //   let data: any ={
  //     grade : this.slipForm.get('grade')?.value,
  //     gradeRemarks : this.slipForm.get('gradeRemarks')?.value
  //   }

  //   this.edit = this.salesService.updateCustomerGrade(this.gradeId, data).subscribe((res)=>{
  //     this._snackBar.open("Grade updated successfully...","" ,{duration:3000})
  //     this.clearControls();
  //     this.dialogRef?.close();
  //   },(error=>{
  //         alert(error.message)
  //       }))
  // }

  onCancelClick(): void {
    this.dialogRef.close();
  }
}

