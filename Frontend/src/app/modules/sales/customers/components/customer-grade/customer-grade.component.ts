import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { DeleteDialogueComponent } from 'src/app/modules/shared-components/delete-dialogue/delete-dialogue.component';
import { CustomerGrade } from '../../models/customer-grade';
import { SalesService } from '../../../sales.service';

@Component({
  selector: 'app-customer-grade',
  templateUrl: './customer-grade.component.html',
  styleUrls: ['./customer-grade.component.scss']
})
export class CustomerGradeComponent implements OnInit {

  constructor(private fb: FormBuilder,public salesService: SalesService, private _snackBar: MatSnackBar,
    public dialog: MatDialog, @Optional() public dialogRef: MatDialogRef<CustomerGradeComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any){}

  ngOnDestroy() {
    this.gradeSubscription?.unsubscribe()
    if(this.submit){
      this.submit.unsubscribe();
    }
    if(this.edit){
      this.edit.unsubscribe();
    }
    if(this.delete){
      this.delete.unsubscribe();
    }
  }

  customerGradeForm = this.fb.group({
    grade: ['', Validators.required],
    gradeRemarks : ['']
  });

  displayedColumns : string[] = ['id','grade', 'gradeRemarks', 'manage']

  addStatus!: string
  ngOnInit(): void {
    this.getGrade()

    if (this.dialogRef) {
      this.addStatus = this.dialogData?.status;
      this.patchData()
    }
  }

  submit!: Subscription
  onSubmit(){
    if(!this.customerGradeForm.valid){
      return alert('Please fill the form first')
    }
    this.submit = this.salesService.addCustomerGrade(this.customerGradeForm.getRawValue()).subscribe((res)=>{
      this._snackBar.open("Customer Grade added successfully...","" ,{duration:3000})
      this.clearControls()
    },(error=>{
      alert(error)
    }))
  }

  clearControls(){
    this.getGrade()
    this.customerGradeForm.reset()
    this.customerGradeForm.setErrors(null)
    Object.keys(this.customerGradeForm.controls).forEach(key=>{this.customerGradeForm.get(key)?.setErrors(null)})
  }

  grades: CustomerGrade[] = [];
  gradeSubscription? : Subscription;
  getGrade(){
    this.gradeSubscription = this.salesService.getCustomerGrade().subscribe((res)=>{
      this.grades = res
    })
  }

  delete!: Subscription;
  deleteBrand(id : any){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.delete = this.salesService.deleteCustomerGrade(id).subscribe((res)=>{
          this.getGrade()
          this._snackBar.open("Grade deleted successfully...","" ,{duration:3000})
        },(error=>{
          this._snackBar.open(error.error.message,"" ,{duration:3000})
        }))
      }
    })
  }

  isEdit = false;
  gradeId : any;
  editBrand(id : any){
    const dialogRef = this.dialog.open(CustomerGradeComponent, {
      data: { status: "true" , type : "edit", id: id},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getGrade();
    });
  }

  patchData(){
    this.isEdit = true;
    this.salesService.getCustomerGrade().subscribe(res=>{
      if(this.dialogData?.type === 'edit'){
        // this.editstatus = true
        let grad: any= res.find(x =>x.id == this.dialogData?.id)
        console.log(grad)

        let grade = grad.grade;
        let gradeRemarks = grad.gradeRemarks;

        this.customerGradeForm.patchValue({
          grade : grade,
          gradeRemarks: gradeRemarks
          // status : status,
        })
        this.gradeId = this.dialogData?.id;
      }
    })
  }

  edit!: Subscription;
  editFunction(){
    if(!this.customerGradeForm.valid){
      return alert('Please fill the form first')
    }
    this.isEdit = false;

    let data: any ={
      grade : this.customerGradeForm.get('grade')?.value,
      gradeRemarks : this.customerGradeForm.get('gradeRemarks')?.value
    }

    this.edit = this.salesService.updateCustomerGrade(this.gradeId, data).subscribe((res)=>{
      this._snackBar.open("Grade updated successfully...","" ,{duration:3000})
      this.clearControls();
      this.dialogRef?.close();
    },(error=>{
          alert(error.message)
        }))
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }
}

