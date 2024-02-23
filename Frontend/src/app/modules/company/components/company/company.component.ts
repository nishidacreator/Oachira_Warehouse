import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { DeleteDialogueComponent } from 'src/app/modules/shared-components/delete-dialogue/delete-dialogue.component';
import { User } from 'src/app/modules/users/models/user';
import { UsersService } from 'src/app/modules/users/users.service';
import { CompanyService } from '../../company.service';
import { company } from '../../models/company';
// import { StoreService } from '../../../store/store.service';
// import { StoreComponent } from '../../../store/components/store/store.component';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {

  constructor(private fb: FormBuilder, private companyService: CompanyService, private _snackBar: MatSnackBar,
    public dialog: MatDialog, private userService: UsersService,
    @Optional() public dialogRef: MatDialogRef<CompanyComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any
    ){}

  ngOnDestroy() {
    this.storeSubscription?.unsubscribe();
    this.uploadSubscription?.unsubscribe();
    this.submit?.unsubscribe();
    // this.storeSub?.unsubscribe();
  }

  companyForm = this.fb.group({
    companyName: ['', Validators.required],
    companyCode: ['',Validators.required],
    locationName: ['', Validators.required],
    companyInChargeId: ['', Validators.required],
    isStore: [],
    isWarehouse: [],
    gstId: [],
    apiKey: [ '',Validators.required],

    // cloudinaryId : [''],
    // fileUrl : ['']
  });

  displayedColumns : string[] = ['id','companyName', 'manage']

  addStatus!: string;
  editstatus!: boolean;
  
  ngOnInit(): void {

    this.getCompanies()
    this.getUsers()
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


  // file!: any;
  // url!: any;
  // uploadStatus = false
  // imageUrl!: string;
  // onFileSelected(event: any){
  //   if(event.target.files.length > 0){
  //     this.uploadStatus= true
  //     this.file = event.target.files[0]
  //     let fileType = this.file? this.file.type : '';

  //     if (this.file) {
  //       // You can read the selected file and display it as an image.
  //       const reader = new FileReader();
  //       reader.onload = () => {
  //         this.imageUrl = reader.result as string;
  //       };
  //       reader.readAsDataURL(this.file);
  //     }

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

  submit!: Subscription
  uploadSubscription!: Subscription;
  onSubmit(){
    if(!this.companyForm.valid){
      return alert('Please fill the form first')
    }
    // if(this.file){
    //   this.uploadSubscription = this.storeService.uploadStoreImage(this.file).subscribe(res=>{
    //     this.companyForm.patchValue({
    //       cloudinaryId : res.public_id,
    //       fileUrl: res.url
    //     })

    //     console.log(this.companyForm.getRawValue())
    //     this.submit = this.storeService.addStore(this.companyForm.getRawValue()).subscribe((response)=>{
    //       let data = {
    //         store: this.companyForm.get('storeName')?.value
    //       }
    //       this.dialogRef?.close(data);
    //       this._snackBar.open("store added successfully...","" ,{duration:3000})
    //       this.clearControls()
    //     },(error=>{
    //       alert(error)
    //     }))
    //   })

    // }else{
      console.log(this.companyForm.getRawValue())
      this.submit = this.companyService.addCompany(this.companyForm.getRawValue()).subscribe((response)=>{
        // let data = {
        //   store: response
        // }
        // console.log('hoi',data)
        // this.dialogRef?.close(data);
        console.log('response',response)
        this._snackBar.open("Company added successfully...","" ,{duration:3000})
        this.clearControls()
      },(error=>{
        alert(error)
      }))
    // }
  }

  clearControls(){
    this.getCompanies()
    this.companyForm.reset()
    this.companyForm.setErrors(null)
    Object.keys(this.companyForm.controls).forEach(key=>{this.companyForm.get(key)?.setErrors(null)})
    // this.file = null;
    // this.imageUrl = '';
  }

  company: company[] = [];
  storeSubscription? : Subscription
  dataSource! : MatTableDataSource<any>
  getCompanies(){
    // this.filterValue, this.currentPage, this.pageSize
    this.storeSubscription = this.companyService.getCompanies().subscribe((res:any)=>{
      this.filtered = res;
      this.company = this.filtered;
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
      this.getCompanies();
    }else{
      const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
      this.filtered = this.company.filter(element =>
        element.companyName.toLowerCase().includes(filterValue)
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
      this.getCompanies();
    }
  }

  onInputChange(value: any) {
    this.filterValue = value;
    if (!this.filterValue) {
      this.getCompanies();
    }
  }

  delete!: Subscription;
  deleteCompany(id : any){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.delete = this.companyService.deleteCompany(id).subscribe((res)=>{
          this.getCompanies()
          this._snackBar.open("Company deleted successfully...","" ,{duration:3000})
        },(error=>{
          this._snackBar.open(error.error.message,"" ,{duration:3000})
        }))
      }
    })
  }

  isEdit = false;
  storeId : any;
  editCompany(id : any){
    this.isEdit = true;
    const dialogRef = this.dialog.open(CompanyComponent, {
      data: { status: "true" , type : "edit", id: id},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getCompanies();
    });
  }
  companyId : any;
  patchData(){
    // this.isEdit = true;
    // this.companyService.getCompanies().subscribe(res=>{
    //   if(this.dialogData?.type === 'edit'){
    //     this.editstatus = true
    //     let company: any= res.find(x =>x.id == this.dialogData?.id)
    //     console.log(company)

    //     let companyName = company.companyName;
    //     let companyCode = company.companyCode;
    //     let locationName = company.locationName;
    //     let companyInChargeId = company.companyInChargeId;

    //     let gstId = company.gstId;
    //     let apiKey = company.apiKey;
    //     let isStore = company.isStore;
    //     let isWarehouse= company.isWarehouse;
    //     // this.imageUrl = store.fileUrl;
    //     // console.log(this.imageUrl)

    //     this.companyForm.patchValue({
    //       companyName : companyName,
    //       companyCode: companyCode,
    //       locationName : locationName,
    //       companyInChargeId : companyInChargeId,
    //       isStore : isStore,
    //       isWarehouse: isWarehouse,
    //       gstId : gstId,
    //       apiKey : apiKey
    //     })
    //     this.storeId = this.dialogData?.id;
    //   }
    // })
    this.isEdit = true;
    this.companyService.getCompanies().subscribe((result) => {
      let company = result.find(x=>x.id === this.dialogData.id)
      console.log(company);

      this.companyId = this.dialogData.id

           let companyName = company?.companyName;
        let companyCode = company?.companyCode;
        let locationName = company?.locationName;
        let companyInChargeId = company?.companyInChargeId;

        let gstId = company?.gstId;
        let apiKey = company?.apiKey;
        let isStore = company?.isStore;
        let isWarehouse= company?.isWarehouse;
        // this.imageUrl = store.fileUrl;
        // console.log(this.imageUrl)

        this.companyForm.patchValue({
          companyName : companyName,
          companyCode: companyCode,
          locationName : locationName,
          // companyInChargeId : companyInChargeId,
          // isStore : isStore,
          // isWarehouse: isWarehouse,
          // gstId : gstId,
          apiKey : apiKey
        })
        this.storeId = this.dialogData?.id;



    })
  }

  edit!:Subscription;
  editFunction(){
    if(!this.companyForm.valid){
      return alert('Please fill the form first')
    }
    // if(this.file){
    //   let image = {
    //     fileUrl: this.imageUrl,
    //   }
    //   this.uploadSubscription = this.storeService.updateStoreImage(this.file, image).subscribe(res=>{
    //     this.companyForm.patchValue({
    //       cloudinaryId : res.public_id,
    //       fileUrl: res.url
    //     })
    //     let data={
    //       storeName  : this.companyForm.get('storeName')?.value,
    //       storeLocation  : this.companyForm.get('storeLocation')?.value,
    //       counterCount : this.companyForm.get('counterCount')?.value,
    //       storeInChargeId : this.companyForm.get('storeInChargeId')?.value,
    //       phoneNumber : this.companyForm.get('phoneNumber')?.value,
    //       gstId : this.companyForm.get('gstId')?.value,
    //       storeBaseUrl : this.companyForm.get('storeBaseUrl')?.value,
    //       status : this.companyForm.get('status')?.value,
    //       cloudinaryId : this.companyForm.get('cloudinaryId')?.value,
    //       fileUrl : this.companyForm.get('fileUrl')?.value
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
        companyName  : this.companyForm.get('companyName')?.value,
        companyCode:  this.companyForm.get('companyCode')?.value,
        locationName  : this.companyForm.get('locationName')?.value,
        counterCount : this.companyForm.get('counterCount')?.value,
        companyInChargeId : this.companyForm.get('companyInChargeId')?.value,
        phoneNumber : this.companyForm.get('phoneNumber')?.value,
        isStore : this.companyForm.get('isStore')?.value,
        isWarehouse : this.companyForm.get('isWarehouse')?.value,
        gstId : this.companyForm.get('gstId')?.value,
        apiKey : this.companyForm.get('storeBaseUrl')?.value,
        // status : this.companyForm.get('status')?.value
      }
      console.log(data);
      this.submit = this.companyService.updateCompany(this.storeId, data).subscribe((res)=>{
        console.log(res);

        this._snackBar.open("company updated successfully...","" ,{duration:3000})
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
    this.getCompanies();
  }

  clearFileInput() {
    // this.imageUrl = '';
  }
}


