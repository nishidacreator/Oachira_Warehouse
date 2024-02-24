import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { CompanyService } from 'src/app/modules/company/company.service';
import { CompanyComponent } from 'src/app/modules/company/components/company/company.component';
import { company } from 'src/app/modules/company/models/company';
import { DeleteDialogueComponent } from 'src/app/modules/shared-components/delete-dialogue/delete-dialogue.component';
import { User } from 'src/app/modules/users/models/user';
import { UsersService } from 'src/app/modules/users/users.service';
import { PurchaseService } from '../../purchase.service';
import { Transporter } from '../../models/transporter';

@Component({
  selector: 'app-transporter',
  templateUrl: './transporter.component.html',
  styleUrls: ['./transporter.component.scss']
})
export class TransporterComponent implements OnInit {


  constructor(private fb: FormBuilder, private purchaseService: PurchaseService, private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    @Optional() public dialogRef: MatDialogRef<CompanyComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any
    ){}

  ngOnDestroy() {
    this.transporterSubscription?.unsubscribe();
    this.submit?.unsubscribe();
    // this.storeSub?.unsubscribe();
  }

  transporterForm = this.fb.group({
    name: ['', Validators.required],
    address: ['',Validators.required],
    contactNumber: ['', Validators.required],

  });

  displayedColumns : string[] = ['id','name','address','contactNumber', 'manage']

  addStatus!: string;
  editstatus!: boolean;

  ngOnInit(): void {

    this.getTransporters()

    if(this.dialogRef){
      this.addStatus = this.dialogData?.status;
      if(this.dialogData.type === 'edit'){
        this.patchData()
      }
      // if(this.dialogData.category){
      //   this.getCategory(this.dialogData.category)
      // }
    }
  }



  submit!: Subscription

  onSubmit(){
    if(!this.transporterForm.valid){
      return alert('Please fill the form first')
    }

      console.log(this.transporterForm.getRawValue())
      this.submit = this.purchaseService.addTransporter(this.transporterForm.getRawValue()).subscribe((response)=>{
        let data = {
          trans: response
        }
        console.log('hoi',data)
        this.dialogRef?.close(data);
        console.log('response',response)
        this._snackBar.open("Transporter added successfully...","" ,{duration:3000})
        this.clearControls()
      },(error=>{
        alert(error)
      }))
    // }
  }

  clearControls(){
    this.getTransporters()
    this.transporterForm.reset()
    this.transporterForm.setErrors(null)
    Object.keys(this.transporterForm.controls).forEach(key=>{this.transporterForm.get(key)?.setErrors(null)})
    // this.file = null;
    // this.imageUrl = '';
  }

  transporter: Transporter[] = [];
  transporterSubscription? : Subscription
  dataSource! : MatTableDataSource<any>
  getTransporters(){
    // this.filterValue, this.currentPage, this.pageSize
    this.transporterSubscription = this.purchaseService.getTransporters().subscribe((res:any)=>{
      this.filtered = res;
      this.transporter = this.filtered;
      this.totalItems = res.count;
    })
  }



  filtered!: any[];
  applyFilter(event: Event): void {
    if((event.target as HTMLInputElement).value.trim() === '') {
      this.getTransporters();
    }else{
      const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
      this.filtered = this.transporter.filter(element =>
        element.name.toLowerCase().includes(filterValue)
        || element.id.toString().includes(filterValue)
        // || element.status.toString().includes(filterValue)
    );
    }
  }

  isImageEnlarged: boolean[] = [];
  enlargeImage(index: number, isEnlarged: boolean): void {
    this.isImageEnlarged[index] = isEnlarged;
  }

  pageSize = 10;
  currentPage = 1;
  totalItems = 0;
  filterValue = "";
  search() {
    if (this.filterValue) {
      this.getTransporters();
    }
  }

  onInputChange(value: any) {
    this.filterValue = value;
    if (!this.filterValue) {
      this.getTransporters();
    }
  }

  delete!: Subscription;
  deleteCompany(id : any){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.delete = this.purchaseService.deleteTransporter(id).subscribe((res)=>{
          this.getTransporters()
          this._snackBar.open("Transporter deleted successfully...","" ,{duration:3000})
        },(error=>{
          this._snackBar.open(error.error.message,"" ,{duration:3000})
        }))
      }
    })
  }

  isEdit = false;
  transporterId : any;
  editTransporter(id : any){
    this.isEdit = true;
    const dialogRef = this.dialog.open(TransporterComponent, {
      data: { status: "true" , type : "edit", id: id},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getTransporters();
    });
  }

  patchData(){
    this.editstatus = true
    this.isEdit = true;
    this.purchaseService.getTransporters().subscribe((result) => {
      let trans = result.find(x=>x.id === this.dialogData.id)
      console.log(trans);



        let name = trans?.name;
        let address = trans?.address;
        let contactNumber = trans?.contactNumber;



        this.transporterForm.patchValue({
          name : name,
          address: address,
          contactNumber : contactNumber,

        })
        this.transporterId = this.dialogData?.id;

      })

  }

  edit!:Subscription;
  editFunction(){
    if(!this.transporterForm.valid){
      return alert('Please fill the form first')
    }


      let data={
        name  : this.transporterForm.get('name')?.value,
        companyCode:  this.transporterForm.get('companyCode')?.value,
        contactNumber  : this.transporterForm.get('contactNumber')?.value,

        // status : this.transporterForm.get('status')?.value
      }
      console.log(data);
      this.submit = this.purchaseService.updateTransporter(this.transporterId, data).subscribe((res)=>{
        console.log(res);

        this._snackBar.open("Transporter updated successfully...","" ,{duration:3000})
        this.dialogRef.close();
        this.clearControls();
      },(error=>{
            alert(error.message)
          }))
    }


  onCancelClick(): void {
    this.dialogRef.close();
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getTransporters();
  }

  clearFileInput() {
    // this.imageUrl = '';
  }
}



