import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { DeleteDialogueComponent } from 'src/app/modules/shared-components/delete-dialogue/delete-dialogue.component';
import { Hsn } from '../../models/hsn';
import { ProductService } from '../../product.service';

@Component({
  selector: 'app-hsn',
  templateUrl: './hsn.component.html',
  styleUrls: ['./hsn.component.scss']
})
export class HsnComponent implements OnInit {

  constructor(private fb: FormBuilder,public productService: ProductService, private _snackBar: MatSnackBar,
    private dialog: MatDialog, @Optional() public dialogRef: MatDialogRef<HsnComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any){}

  ngOnDestroy() {
    this.hsnSubcription?.unsubscribe()
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

  hsnForm = this.fb.group({
    hsnName: ['', Validators.required]
  });

  displayedColumns : string[] = ['id','hsnName','ihsn','chsn','shsn','manage']

  addStatus!: string;
  editstatus!: boolean;
  ngOnInit(): void {
    this.getHSN();
    if (this.dialogRef) {
      this.addStatus = this.dialogData?.status;

      this.patchData()
    }
  }

  submit!: Subscription;
  onSubmit(){
    if(!this.hsnForm.valid){
      return alert('Please fill the form first')
    }
    this.submit = this.productService.addHsn(this.hsnForm.getRawValue()).subscribe((res)=>{
      this._snackBar.open("HSN added successfully...","" ,{duration:3000})
      let data = {
        hsn: this.hsnForm.get('hsnName')?.value
      }
      this.dialogRef?.close(data);
      this.clearControls()
    },(error=>{
      alert(error)
    }))
  }

  clearControls(){
    this.hsnForm.reset()
    this.hsnForm.setErrors(null)
    Object.keys(this.hsnForm.controls).forEach(key=>{this.hsnForm.get(key)?.setErrors(null)})
    this.getHSN()
  }

  hsn: Hsn[] = [];
  hsnSubcription? : Subscription;
  getHSN(){
    this.hsnSubcription = this.productService.getHsn().subscribe((res)=>{
      console.log(res);

      this.hsn = res
      this.filtered = this.hsn
    })
  }

  filterValue: any;
  filtered!: any[];
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filterValue = filterValue;
    this.filtered = this.hsn.filter(element =>
      element.hsnName.includes(filterValue)
    );
  }

  delete!: Subscription;
  deleteHSN(id : any){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.delete = this.productService.deleteHsn(id).subscribe((res)=>{
          this.getHSN()
          this._snackBar.open("HSN deleted successfully...","" ,{duration:3000})
        },(error=>{
          this._snackBar.open(error.error.message,"" ,{duration:3000})
        }))
      }
    })
  }

  isEdit = false;
  hsnId : any;
  editHSN(id : any){
    this.isEdit = true;
    const dialogRef = this.dialog.open(HsnComponent, {
      data: { status: "true" , type : "edit", id: id},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getHSN();
    });
  }

  patchData(){
    this.productService.getHsn().subscribe(res=>{
      if(this.dialogData?.type === 'edit'){
        this.editstatus = true
        console.log(res)
        let hsn: any= this.hsn.find(x =>x.id == this.dialogData.id)

        //Populate the object by the ID
        let hsnName = hsn.hsnName.toString()

        this.hsnForm.patchValue({
          hsnName : hsnName
        })
        this.hsnId = this.dialogData.id;
      }
    })
  }

  edit!: Subscription;
  editFunction(){
    if(!this.hsnForm.valid){
      return alert('Please fill the form first')
    }
    this.isEdit = false;

    let data: any ={
      hsnName : this.hsnForm.get('hsnName')?.value
    }

    this.edit = this.productService.updateHsn(this.hsnId, data).subscribe((res)=>{
      this._snackBar.open("HSN updated successfully...","" ,{duration:3000})
      this.clearControls();
      this.dialogRef?.close();
    },(error=>{
          alert(error.message)
        }))
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onToggleChange(event: any, id: number) {
    const newValue = event.checked;

    let data = {
      status : newValue
    }
    this.productService.updateHsnStatus(id, data).subscribe(data=>{
      console.log(data);
    });
  }
}
