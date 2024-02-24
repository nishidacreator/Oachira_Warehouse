import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { DeleteDialogueComponent } from 'src/app/modules/shared-components/delete-dialogue/delete-dialogue.component';
import { ProductService } from '../../product.service';
import { Gst } from '../../models/gst';

@Component({
  selector: 'app-gst',
  templateUrl: './gst.component.html',
  styleUrls: ['./gst.component.scss']
})
export class GstComponent implements OnInit {

  constructor(private fb: FormBuilder,public productService: ProductService, private _snackBar: MatSnackBar,
    private dialog: MatDialog, @Optional() public dialogRef: MatDialogRef<GstComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any){}

  ngOnDestroy() {
    this.gstSubcription?.unsubscribe()
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

  gstForm = this.fb.group({
    gstName: ['', Validators.required],
    igst: ['',[Validators.required, Validators.pattern("^\\d*\\.?\\d{0,2}$")]],
    cgst: ['',[Validators.pattern("^\\d*\\.?\\d{0,2}$")]],
    sgst: ['',[Validators.pattern("^\\d*\\.?\\d{0,2}$")]]
  });

  displayedColumns : string[] = ['id','gstName','igst','cgst','sgst','manage']

  addStatus!: string;
  editstatus!: boolean;
  ngOnInit(): void {
    this.getGst();
    if (this.dialogRef) {
      this.addStatus = this.dialogData?.status;

      this.patchData()
    }
  }

  sgst : any;
  cgst : any;
  gstCalc : any;
  calculateGst(){
    let igst:any = (this.gstForm.getRawValue().igst)
    this.gstCalc = igst/2
    this.sgst = igst/2
    this.cgst = igst/2
    this.gstForm.get('sgst')?.setValue(this.sgst)
    this.gstForm.get('cgst')?.setValue(this.cgst)
  }

  submit!: Subscription;
  onSubmit(){
    if(!this.gstForm.valid){
      return alert('Please fill the form first')
    }
    this.submit = this.productService.addGst(this.gstForm.getRawValue()).subscribe((res)=>{
      this._snackBar.open("Gst added successfully...","" ,{duration:3000})
      let data = {
        gst: this.gstForm.get('gstName')?.value
      }
      this.dialogRef?.close(data);
      this.clearControls()
    },(error=>{
      alert(error)
    }))
  }

  clearControls(){
    this.gstForm.reset()
    this.getGst()
  }

  gst: Gst[] = [];
  gstSubcription? : Subscription;
  getGst(){
    this.gstSubcription = this.productService.getGst().subscribe((res)=>{
      this.gst = res
      this.filtered = this.gst
    })
  }

  filterValue: any;
  filtered!: any[];
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filterValue = filterValue;
    this.filtered = this.gst.filter(element =>
      element.gstName.includes(filterValue)
    );
  }

  delete!: Subscription;
  deleteGst(id : any){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.delete = this.productService.deleteGst(id).subscribe((res)=>{
          this.getGst()
          this._snackBar.open("Gst deleted successfully...","" ,{duration:3000})
        },(error=>{
          this._snackBar.open(error.error.message,"" ,{duration:3000})
        }))
      }
    })
  }

  isEdit = false;
  gstId : any;
  editGst(id : any){
    this.isEdit = true;
    const dialogRef = this.dialog.open(GstComponent, {
      data: { status: "true" , type : "edit", id: id},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getGst();
    });
  }

  patchData(){
    this.productService.getLocation().subscribe(res=>{
      if(this.dialogData?.type === 'edit'){
        this.editstatus = true
        console.log(res)
        let gst: any= this.gst.find(x =>x.id == this.dialogData.id)

        //Populate the object by the ID
        let gstName = gst.gstName.toString()
        let igst = gst.igst
        let cgst = gst.cgst
        let sgst = gst.sgst

        this.gstForm.patchValue({
          gstName : gstName,
          igst : igst,
          cgst : cgst,
          sgst : sgst
        })
        this.gstId = this.dialogData.id;
      }
    })
  }

  edit!: Subscription;
  editFunction(){
    if(!this.gstForm.valid){
      return alert('Please fill the form first')
    }
    this.isEdit = false;

    let data: any ={
      gstName : this.gstForm.get('gstName')?.value,
      igst : this.gstForm.get('igst')?.value,
      cgst : this.gstForm.get('cgst')?.value,
      sgst : this.gstForm.get('sgst')?.value
    }

    this.edit = this.productService.updateGst(this.gstId, data).subscribe((res)=>{
      this._snackBar.open("Gst updated successfully...","" ,{duration:3000})
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
    this.productService.updateGstStatus(id, data).subscribe(data=>{
      console.log(data);
    });
  }
}
