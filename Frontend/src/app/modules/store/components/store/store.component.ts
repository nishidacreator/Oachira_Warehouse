import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { DeleteDialogueComponent } from '../../../shared-components/delete-dialogue/delete-dialogue.component';
import { StoreService } from '../../store.service';
import { Store } from '../../models/store';
import { UsersService } from 'src/app/modules/users/users.service';
import { User } from 'src/app/modules/users/models/user';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {

  constructor(private fb: FormBuilder, private storeService: StoreService, private _snackBar: MatSnackBar,
    public dialog: MatDialog, private userService: UsersService,
    @Optional() public dialogRef: MatDialogRef<StoreComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any
    ){}

  ngOnDestroy() {
    this.storeSubscription?.unsubscribe();
    this.uploadSubscription?.unsubscribe();
    this.submit?.unsubscribe();
    // this.storeSub?.unsubscribe();
  }

  storeForm = this.fb.group({
    storeName: ['', Validators.required],
    storeInChargeId: [ Validators.required],
    phoneNumber: ['', Validators.required],
    storeLocation: ['', Validators.required],
    counterCount: [ Validators.required],
    gstId: [],
    storeBaseUrl: [ Validators.required],
    status : [false ,Validators.required],
    cloudinaryId : [''],
    fileUrl : ['']
  });

  displayedColumns : string[] = ['id','storeName', 'manage']

  addStatus!: string;
  editstatus!: boolean;
  ngOnInit(): void {
    if (this.dialogRef) {
      this.addStatus = this.dialogData?.status;
      this.patchData()
    }
    this.storeForm.get('status')?.setValue(true);
    this.getstore()
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
      this.storeForm.get('phoneNumber')?.setValue(res.phoneNumber)
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
    if(!this.storeForm.valid){
      return alert('Please fill the form first')
    }
    // if(this.file){
    //   this.uploadSubscription = this.storeService.uploadStoreImage(this.file).subscribe(res=>{
    //     this.storeForm.patchValue({
    //       cloudinaryId : res.public_id,
    //       fileUrl: res.url
    //     })

    //     console.log(this.storeForm.getRawValue())
    //     this.submit = this.storeService.addStore(this.storeForm.getRawValue()).subscribe((response)=>{
    //       let data = {
    //         store: this.storeForm.get('storeName')?.value
    //       }
    //       this.dialogRef?.close(data);
    //       this._snackBar.open("store added successfully...","" ,{duration:3000})
    //       this.clearControls()
    //     },(error=>{
    //       alert(error)
    //     }))
    //   })

    // }else{
      console.log(this.storeForm.getRawValue())
      this.submit = this.storeService.addStore(this.storeForm.getRawValue()).subscribe((response)=>{
        let data = {
          store: response
        }
        this.dialogRef?.close(data);
        this._snackBar.open("store added successfully...","" ,{duration:3000})
        this.clearControls()
      },(error=>{
        alert(error)
      }))
    // }
  }

  clearControls(){
    this.getstore()
    this.storeForm.reset()
    this.storeForm.setErrors(null)
    Object.keys(this.storeForm.controls).forEach(key=>{this.storeForm.get(key)?.setErrors(null)})
    this.file = null;
    this.imageUrl = '';
  }

  stores: Store[] = [];
  storeSubscription? : Subscription
  dataSource! : MatTableDataSource<any>
  getstore(){
    // this.filterValue, this.currentPage, this.pageSize
    this.storeSubscription = this.storeService.getStore().subscribe((res:any)=>{
      this.filtered = res;
      this.stores = this.filtered;
      this.totalItems = res.count;
    })
  }

  // storeSub!: Subscription;
  // getComplete(){
  //   this.storeSub = this.storeService.getStore().subscribe((res:any)=>{
  //     this.stores = res;
  //   })
  // }

  filtered!: any[];
  applyFilter(event: Event): void {
    if((event.target as HTMLInputElement).value.trim() === '') {
      this.getstore();
    }else{
      const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
      this.filtered = this.stores.filter(element =>
        element.storeName.toLowerCase().includes(filterValue)
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
      this.getstore();
    }
  }

  onInputChange(value: any) {
    this.filterValue = value;
    if (!this.filterValue) {
      this.getstore();
    }
  }

  delete!: Subscription;
  deleteStore(id : any){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.delete = this.storeService.deleteStore(id).subscribe((res)=>{
          this.getstore()
          this._snackBar.open("store deleted successfully...","" ,{duration:3000})
        },(error=>{
          this._snackBar.open(error.error.message,"" ,{duration:3000})
        }))
      }
    })
  }

  isEdit = false;
  storeId : any;
  editStore(id : any){
    this.isEdit = true;
    const dialogRef = this.dialog.open(StoreComponent, {
      data: { status: "true" , type : "edit", id: id},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getstore();
    });
  }

  patchData(){
    this.storeService.getStore().subscribe(res=>{
      if(this.dialogData?.type === 'edit'){
        this.editstatus = true
        let store: any= res.find(x =>x.id == this.dialogData?.id)
        console.log(store)

        let storeName = store.storeName;
        let storeLocation = store.storeLocation;
        let counterCount = store.counterCount;
        let storeInChargeId = store.storeInChargeId;
        let phoneNumber = store.phoneNumber;
        let gstId = store.gstId;
        let storeBaseUrl = store.storeBaseUrl;
        let status = store.status;
        this.imageUrl = store.fileUrl;
        console.log(this.imageUrl)

        this.storeForm.patchValue({
          storeName : storeName,
          storeLocation : storeLocation,
          counterCount : counterCount,
          storeInChargeId : storeInChargeId,
          phoneNumber : phoneNumber,
          gstId : gstId,
          storeBaseUrl : storeBaseUrl,
          status : status,
        })
        this.storeId = this.dialogData?.id;
      }
    })
  }

  edit!:Subscription;
  editFunction(){
    // if(this.file){
    //   let image = {
    //     fileUrl: this.imageUrl,
    //   }
    //   this.uploadSubscription = this.storeService.updateStoreImage(this.file, image).subscribe(res=>{
    //     this.storeForm.patchValue({
    //       cloudinaryId : res.public_id,
    //       fileUrl: res.url
    //     })
    //     let data={
    //       storeName  : this.storeForm.get('storeName')?.value,
    //       storeLocation  : this.storeForm.get('storeLocation')?.value,
    //       counterCount : this.storeForm.get('counterCount')?.value,
    //       storeInChargeId : this.storeForm.get('storeInChargeId')?.value,
    //       phoneNumber : this.storeForm.get('phoneNumber')?.value,
    //       gstId : this.storeForm.get('gstId')?.value,
    //       storeBaseUrl : this.storeForm.get('storeBaseUrl')?.value,
    //       status : this.storeForm.get('status')?.value,
    //       cloudinaryId : this.storeForm.get('cloudinaryId')?.value,
    //       fileUrl : this.storeForm.get('fileUrl')?.value
    //     }
    //     console.log(data)
    //     this.submit = this.storeService.updateStore(this.storeId, data).subscribe((res)=>{
    //       console.log(res)
    //       this._snackBar.open("store updated successfully...","" ,{duration:3000})
    //       this.dialogRef.close();
    //       this.clearControls();
    //     },(error=>{
    //           alert(error.message)
    //         }))
    //   })
    // }else{
      let data={
        storeName  : this.storeForm.get('storeName')?.value,
        storeLocation  : this.storeForm.get('storeLocation')?.value,
        counterCount : this.storeForm.get('counterCount')?.value,
        storeInChargeId : this.storeForm.get('storeInChargeId')?.value,
        phoneNumber : this.storeForm.get('phoneNumber')?.value,
        gstId : this.storeForm.get('gstId')?.value,
        storeBaseUrl : this.storeForm.get('storeBaseUrl')?.value,
        status : this.storeForm.get('status')?.value
      }
      console.log(data);
      this.submit = this.storeService.updateStore(this.storeId, data).subscribe((res)=>{
        console.log(res);

        this._snackBar.open("store updated successfully...","" ,{duration:3000})
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
    this.getstore();
  }

  clearFileInput() {
    this.imageUrl = '';
  }
}

