import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { StoreService } from '../../store.service';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { DeleteDialogueComponent } from 'src/app/modules/shared-components/delete-dialogue/delete-dialogue.component';
import { User } from 'src/app/modules/users/models/user';
import { UsersService } from 'src/app/modules/users/users.service';
import { Warehouse } from '../../models/warehouse';

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.scss']
})
export class WarehouseComponent implements OnInit {

  constructor(private fb: FormBuilder, private storeService: StoreService, private _snackBar: MatSnackBar,
    public dialog: MatDialog, private userService: UsersService,
    @Optional() public dialogRef: MatDialogRef<WarehouseComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any
    ){}

  ngOnDestroy() {
    this.warehouseSubscription?.unsubscribe();
    this.uploadSubscription?.unsubscribe();
    this.submit?.unsubscribe();
    // this.warehouseSub?.unsubscribe();
  }

  warehouseForm = this.fb.group({
    warehouseName: ['', Validators.required],
    warehouseInChargeId: [ Validators.required],
    phoneNumber: ['', Validators.required],
    warehouseLocation: ['', Validators.required],
    panNo : [''],
    fssaiNo : [''],
    gstIn : [''],
    state : [''],
    status : [false ,Validators.required],
    cloudinaryId : [''],
    fileUrl : ['']
  });

  displayedColumns : string[] = ['id','warehouseName', 'manage']

  addStatus!: string;
  editstatus!: boolean;
  ngOnInit(): void {
    if (this.dialogRef) {
      this.addStatus = this.dialogData?.status;
      this.patchData()
    }
    this.warehouseForm.get('status')?.setValue(true);
    this.getwarehouse()
    // this.getComplete()
    this.getUsers()
  }

  users!: User[];
  getUsers(){
    this.userService.getUser().subscribe(user =>{
      this.users = user;
      this.filteredUser = this.users;
    })
  }

  // myUser = new FormControl<string | User>("");
  filteredUser: User[] = [];
  filterUser(event?: Event | string) {
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

  }

  getPhoneNumber(id: number){
    this.userService.getUserById(id).subscribe(res=>{
      this.warehouseForm.get('phoneNumber')?.setValue(res.phoneNumber)
    })
  }

  file!: any;
  url!: any;
  uploadStatus = false
  imageUrl!: string;
  onFileSelected(event: any){
    if(event.target.files.length > 0){
      this.uploadStatus= true
      this.file = event.target.files[0]
      let fileType = this.file? this.file.type : '';

      if (this.file) {
        // You can read the selected file and display it as an image.
        const reader = new FileReader();
        reader.onload = () => {
          this.imageUrl = reader.result as string;
        };
        reader.readAsDataURL(this.file);
      }

      // if(fileType.match(/image\/*/)){
      //   let reader = new FileReader();
      //   // reader.readAsDataURL(this.file)
      //   reader.onload = (event: any) =>{
      //     this.url = event.target.result;
      //   }
      // }
      // else {
      //   window.alert('Please select correct image format');
      // }
    }
  }

  submit!: Subscription
  uploadSubscription!: Subscription;
  onSubmit(){
    // if(this.file){
    //   this.uploadSubscription = this.warehouseService.uploadWarehouseImage(this.file).subscribe(res=>{
    //     this.warehouseForm.patchValue({
    //       cloudinaryId : res.public_id,
    //       fileUrl: res.url
    //     })

    //     console.log(this.warehouseForm.getRawValue())
    //     this.submit = this.warehouseService.addWarehouse(this.warehouseForm.getRawValue()).subscribe((response)=>{
    //       let data = {
    //         warehouse: this.warehouseForm.get('warehouseName')?.value
    //       }
    //       this.dialogRef?.close(data);
    //       this._snackBar.open("warehouse added successfully...","" ,{duration:3000})
    //       this.clearControls()
    //     },(error=>{
    //       alert(error)
    //     }))
    //   })

    // }else{
      console.log(this.warehouseForm.getRawValue())
      this.submit = this.storeService.addWarehouse(this.warehouseForm.getRawValue()).subscribe((response)=>{
        let data = {
          warehouse: this.warehouseForm.get('warehouseName')?.value
        }
        this.dialogRef?.close(data);
        this._snackBar.open("warehouse added successfully...","" ,{duration:3000})
        this.clearControls()
      },(error=>{
        alert(error)
      }))
    // }
  }

  clearControls(){
    this.getwarehouse()
    this.warehouseForm.reset()
    this.warehouseForm.setErrors(null)
    Object.keys(this.warehouseForm.controls).forEach(key=>{this.warehouseForm.get(key)?.setErrors(null)})
    this.file = null;
    this.imageUrl = '';
  }

  warehouses: Warehouse[] = [];
  warehouseSubscription? : Subscription
  dataSource! : MatTableDataSource<any>
  getwarehouse(){
    this.warehouseSubscription = this.storeService.getWarehouse().subscribe((res:any)=>{
      this.filtered = res;
      console.log(res);

      this.warehouses = this.filtered;
      this.totalItems = res.count;
    })
  }

  // warehouseSub!: Subscription;
  // getComplete(){
  //   this.warehouseSub = this.warehouseService.getWarehouse().subscribe((res:any)=>{
  //     this.warehouses = res;
  //   })
  // }

  filtered!: any[];
  applyFilter(event: Event): void {
    if((event.target as HTMLInputElement).value.trim() === '') {
      this.getwarehouse();
    }else{
      const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
      this.filtered = this.warehouses.filter(element =>
        element.warehouseName.toLowerCase().includes(filterValue)
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
      this.getwarehouse();
    }
  }

  onInputChange(value: any) {
    this.filterValue = value;
    if (!this.filterValue) {
      this.getwarehouse();
    }
  }

  delete!: Subscription;
  deleteWarehouse(id : any){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.delete = this.storeService.deletewarehouse(id).subscribe((res)=>{
          this.getwarehouse()
          this._snackBar.open("warehouse deleted successfully...","" ,{duration:3000})
        },(error=>{
          this._snackBar.open(error.error.message,"" ,{duration:3000})
        }))
      }
    })
  }

  isEdit = false;
  warehouseId : any;
  editWarehouse(id : any){
    this.isEdit = true;
    const dialogRef = this.dialog.open(WarehouseComponent, {
      data: { status: "true" , type : "edit", id: id},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getwarehouse();
    });
  }

  patchData(){
    // this.storeService.getWarehouse().subscribe(res=>{
    //   if(this.dialogData?.type === 'edit'){
    //     this.editstatus = true
    //     let warehouse: any= res.find(x =>x.id == this.dialogData?.id)
    //     console.log(warehouse)

    //     let warehouseName = warehouse.warehouseName;
    //     let warehouseLocation = warehouse.warehouseLocation;
    //     let counterCount = warehouse.counterCount;
    //     let warehouseInChargeId = warehouse.warehouseInChargeId;
    //     let phoneNumber = warehouse.phoneNumber;
    //     let gstId = warehouse.gstId;
    //     let warehouseBaseUrl = warehouse.warehouseBaseUrl;
    //     let status = warehouse.status;
    //     this.imageUrl = warehouse.fileUrl;
    //     console.log(this.imageUrl)

    //     this.warehouseForm.patchValue({
    //       warehouseName : warehouseName,
    //       warehouseLocation : warehouseLocation,
    //       counterCount : counterCount,
    //       warehouseInChargeId : warehouseInChargeId,
    //       phoneNumber : phoneNumber,
    //       gstId : gstId,
    //       warehouseBaseUrl : warehouseBaseUrl,
    //       status : status,
    //     })
    //     this.warehouseId = this.dialogData?.id;
    //   }
    // })
  }

  edit!:Subscription;
  editFunction(){
    // if(this.file){
    //   let image = {
    //     fileUrl: this.imageUrl,
    //   }
    //   this.uploadSubscription = this.warehouseService.updateWarehouseImage(this.file, image).subscribe(res=>{
    //     this.warehouseForm.patchValue({
    //       cloudinaryId : res.public_id,
    //       fileUrl: res.url
    //     })
    //     let data={
    //       warehouseName  : this.warehouseForm.get('warehouseName')?.value,
    //       warehouseLocation  : this.warehouseForm.get('warehouseLocation')?.value,
    //       counterCount : this.warehouseForm.get('counterCount')?.value,
    //       warehouseInChargeId : this.warehouseForm.get('warehouseInChargeId')?.value,
    //       phoneNumber : this.warehouseForm.get('phoneNumber')?.value,
    //       gstId : this.warehouseForm.get('gstId')?.value,
    //       warehouseBaseUrl : this.warehouseForm.get('warehouseBaseUrl')?.value,
    //       status : this.warehouseForm.get('status')?.value,
    //       cloudinaryId : this.warehouseForm.get('cloudinaryId')?.value,
    //       fileUrl : this.warehouseForm.get('fileUrl')?.value
    //     }
    //     console.log(data)
    //     this.submit = this.warehouseService.updateWarehouse(this.warehouseId, data).subscribe((res)=>{
    //       console.log(res)
    //       this._snackBar.open("warehouse updated successfully...","" ,{duration:3000})
    //       this.dialogRef.close();
    //       this.clearControls();
    //     },(error=>{
    //           alert(error.message)
    //         }))
    //   })
    // }else{
      let data={
        warehouseName  : this.warehouseForm.get('warehouseName')?.value,
        warehouseLocation  : this.warehouseForm.get('warehouseLocation')?.value,
        counterCount : this.warehouseForm.get('counterCount')?.value,
        warehouseInChargeId : this.warehouseForm.get('warehouseInChargeId')?.value,
        phoneNumber : this.warehouseForm.get('phoneNumber')?.value,
        gstId : this.warehouseForm.get('gstId')?.value,
        warehouseBaseUrl : this.warehouseForm.get('warehouseBaseUrl')?.value,
        status : this.warehouseForm.get('status')?.value
      }
      console.log(data);
      this.submit = this.storeService.updatewarehouse(this.warehouseId, data).subscribe((res)=>{
        console.log(res);

        this._snackBar.open("warehouse updated successfully...","" ,{duration:3000})
        this.dialogRef.close();
        this.clearControls();
      },(error=>{
            alert(error.message)
          }))
    // }
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getwarehouse();
  }

  clearFileInput() {
    this.imageUrl = '';
  }
}


