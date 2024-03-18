import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { DeleteDialogueComponent } from 'src/app/modules/shared-components/delete-dialogue/delete-dialogue.component';
import { Distributor } from '../../models/distributor';
import { ProductService } from '../../product.service';
import { Product } from '../../models/product';
import { ProductDistributorComponent } from '../product-distributor/product-distributor.component';
import { ProductComponent } from '../product/product.component';
import { Team } from 'src/app/modules/company/models/team';
import { CompanyService } from 'src/app/modules/company/company.service';
import { TeamComponent } from 'src/app/modules/company/components/team/team.component';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-distributor',
  templateUrl: './distributor.component.html',
  styleUrls: ['./distributor.component.scss']
})
export class DistributorComponent implements OnInit {

  constructor(private fb: FormBuilder,public productService: ProductService,public companyService: CompanyService, private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    @Optional() public dialogRef: MatDialogRef<DistributorComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any
    ){}

  ngOnDestroy() {
    this.distributorSubscription?.unsubscribe();
    this.uploadSubscription?.unsubscribe();
    this.submit?.unsubscribe();
    this.distributorSub?.unsubscribe();
  }
  teams: Team[] = []
  getTeams() {
    this.companyService.getTeams().subscribe((res) => {
      this.teams = res;
      console.log('teams',res);
    })
  }

  distributorForm = this.fb.group({
    distributorName: ['', Validators.required],
    phoneNumber: ['', Validators.required],
    contactPerson: ['', Validators.required],
    address1: ['', Validators.required],
    address2: [''],
    gstNo: [''],
    panNo: [''],
    fssaiNo: [''],
    state: [''],
    status : [false ,Validators.required],
    cloudinaryId : [''],
    fileUrl : [''],
    teamId : [''],
    products : [''],
    brokerage: [false],
    advance: [false],
    unloading: [false],
    transportation: [false]
  });

  displayedColumns : string[] = ['id','distributorName', 'manage']

  addStatus!: string;
  editstatus!: boolean;
  ngOnInit(): void {
    this.getTeams()
    if (this.dialogRef) {
      this.addStatus = this.dialogData?.status;

      if (this.dialogData?.type == 'edit'){
        this.patchData()
      }
    }
    this.distributorForm.get('status')?.setValue(true);
    this.getDistributor()
    this.getComplete()
    this.getProduct()
  }

  addTeam(){
    const dialogRef = this.dialog.open(TeamComponent, {
      data: { status: "add"},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getTeams()
      console.log((result.hsn.hsnName));

      // this.routeSEDetails().at(i).get('hsn')?.setValue(result.hsn.hsnName);
    });
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

  products: Product[] = [];
  productControl = new FormControl('');
  getProduct(value?: any){
    this.productService.getProduct().subscribe(res=>{
      this.products = res;
      this.filteredProduct = this.products
      if(value){
        this.filterProduct(value);
      }
    })
  }

  myControl = new FormControl<string | Product>("");
  filteredProduct: Product[] = [];
  filterProduct(event: Event | string) {
    let value: string = "";

    if (typeof event === "string") {
      value = event;
    } else if (event instanceof Event) {
      value = (event.target as HTMLInputElement).value;
    }
    this.filteredProduct = this.products.filter((option) => {
      if (
        (option.productName && option.productName.toLowerCase().includes(value?.toLowerCase())) ||
        (option.code && option.code.toLowerCase().includes(value?.toLowerCase()))
      ) {
        return true;
      } else {
        return null;
      }
    });
  }

  addProduct(){
    const dialogRef = this.dialog.open(ProductComponent, {
      data: { status: "true" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getProduct(result?.product);
    });
  }

  submit!: Subscription
  uploadSubscription!: Subscription;
  onSubmit(){
    if(!this.distributorForm.valid){
      return alert('Please fill the form first')
    }
    let form = this.distributorForm.getRawValue().products;
    let products = []
    if (form !== null) {
      for( let i = 0; i < form?.length; i++ ){
        products[i] = {
          productId : form[i]
        }
      }
    }

    let data = {
      distributorName: this.distributorForm.get('distributorName')?.value,
      phoneNumber: this.distributorForm.get('phoneNumber')?.value,
      contactPerson: this.distributorForm.get('contactPerson')?.value,
      address1: this.distributorForm.get('address1')?.value,
      address2: this.distributorForm.get('address2')?.value,
      gstNo: this.distributorForm.get('gstNo')?.value,
      panNo: this.distributorForm.get('panNo')?.value,
      fssaiNo: this.distributorForm.get('fssaiNo')?.value,
      state: this.distributorForm.get('state')?.value,
      status : this.distributorForm.get('status')?.value,
      cloudinaryId : this.distributorForm.get('cloudinaryId')?.value,
      fileUrl : this.distributorForm.get('fileUrl')?.value,
      teamId : this.distributorForm.get('teamId')?.value,
      products : products
    }

    // if(this.file){
    //   this.uploadSubscription = this.productService.uploadDistributorImage(this.file).subscribe(res=>{
    //     this.distributorForm.patchValue({
    //       cloudinaryId : res.public_id,
    //       fileUrl: res.url
    //     })

    //     console.log(this.distributorForm.getRawValue())
    //     this.submit = this.productService.addDistributor(this.distributorForm.getRawValue()).subscribe((response)=>{
    //       let data = {
    //         distributor: this.distributorForm.get('distributorName')?.value
    //       }
    //       this.dialogRef?.close(data);
    //       this._snackBar.open("Distributor added successfully...","" ,{duration:3000})
    //       this.clearControls()
    //     },(error=>{
    //       alert(error)
    //     }))
    //   })

    // }else{
      console.log(data);

      this.submit = this.productService.addDistributor(data).subscribe((response)=>{
        console.log(response);

        let data = {
          distributor: response
        }
        this.dialogRef?.close(data);
        this._snackBar.open("Distributor added successfully...","" ,{duration:3000})
        this.clearControls()
      },(error=>{
        alert(error)
      }))
    // }
  }

  clearControls(){
    this.getDistributor()
    this.distributorForm.reset()
    this.file = null;
    this.imageUrl = '';
  }

  distributors: Distributor[] = [];
  distributorSubscription? : Subscription
  dataSource! : MatTableDataSource<any>
  getDistributor(){
    this.distributorSubscription = this.productService.getPaginatedDistributor(this.filterValue, this.currentPage, this.pageSize).subscribe((res:any)=>{
      this.filtered = res.items;
      this.totalItems = res.count;
    })
  }

  distributorSub!: Subscription;
  getComplete(){
    this.distributorSub = this.productService.getDistributor().subscribe((res:any)=>{
      this.distributors = res;
    })
  }

  filtered!: any[];
  applyFilter(event: Event): void {
    if((event.target as HTMLInputElement).value.trim() === '') {
      this.getDistributor();
    }else{
      const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
      this.filtered = this.distributors.filter(element =>
        element.distributorName.toLowerCase().includes(filterValue)
        || element.id.toString().includes(filterValue)
        // || element.status.toString().includes(filterValue)
    );
    }
  }

  viewProductList(id: number){
    const dialogRef = this.dialog.open(ProductDistributorComponent, {
      data: {id: id, status: false},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getDistributor();
    });
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
      this.getDistributor();
    }
  }

  onInputChange(value: any) {
    this.filterValue = value;
    if (!this.filterValue) {
      this.getDistributor();
    }
  }

  brokerageApplicable(event: any, id: number) {
    if (event instanceof MatSlideToggleChange) {
      const newStatus = event.checked;
      let data = {
        brokerage: newStatus
      }
      this.productService.brokerageApplicable(id, data).subscribe(res=>{
        this._snackBar.open("Brokerage updated successfully...","" ,{duration:3000})
        this.getDistributor()
      })
    }
  }

  advanceApplicable(event: any, id: number) {
    if (event instanceof MatSlideToggleChange) {
      const newStatus = event.checked;
      let data = {
        advance: newStatus
      }
      this.productService.advanceApplicable(id, data).subscribe(res=>{
        this._snackBar.open("Advance updated successfully...","" ,{duration:3000})
        this.getDistributor()
      })
    }
  }

  unloadingApplicable(event: any, id: number) {
    if (event instanceof MatSlideToggleChange) {
      const newStatus = event.checked;
      let data = {
        unloading: newStatus
      }
      this.productService.unloadingApplicable(id, data).subscribe(res=>{
        this._snackBar.open("Unloading updated successfully...","" ,{duration:3000})
        this.getDistributor()
      })
    }
  }

  delete!: Subscription;
  deleteDistributor(id : any){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.delete = this.productService.deleteDistributor(id).subscribe((res)=>{
          this.getDistributor()
          this._snackBar.open("Distributor deleted successfully...","" ,{duration:3000})
        },(error=>{
          this._snackBar.open(error.error.message,"" ,{duration:3000})
        }))
      }
    })
  }

  isEdit = false;
  distributorId : any;
  editDistributor(id : any){
    this.isEdit = true;
    const dialogRef = this.dialog.open(DistributorComponent, {
      data: { status: "true" , type : "edit", id: id},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getDistributor();
    });
  }

  patchData(){
    this.productService.getDistributor().subscribe(res=>{
      if(this.dialogData?.type === 'edit'){
        this.editstatus = true
        let distributor: any= res.find(x =>x.id == this.dialogData?.id)
        console.log(distributor)

        let distributorName = distributor.distributorName;
        let contactPerson = distributor.contactPerson;
        let phoneNumber = distributor.phoneNumber;
        let address1 = distributor.address1;
        let address2 = distributor.address2;
        let state = distributor.state;
        let gstNo = distributor.gstNo;
        let panNo = distributor.panNo;
        let fssaiNo = distributor.fssaiNo;
        let status = distributor.status;
        let team = distributor.teamId;
        this.imageUrl = distributor.fileUrl;
        console.log(this.imageUrl)

        this.distributorForm.patchValue({
          distributorName : distributorName,
          contactPerson : contactPerson,
          address1 : address1,
          address2 : address2,
          phoneNumber : phoneNumber,
          state : state,
          gstNo : gstNo,
          panNo : panNo,
          fssaiNo : fssaiNo,
          status : status,
          teamId : team,
        })
        this.distributorId = this.dialogData?.id;
      }
    })
  }

  edit!:Subscription;
  editFunction(){
    if(!this.distributorForm.valid){
      return alert('Please fill the form first')
    }
    // if(this.file){
    //   let image = {
    //     fileUrl: this.imageUrl,
    //   }
    //   this.uploadSubscription = this.productService.updateDistributorImage(this.file, image).subscribe(res=>{
    //     this.distributorForm.patchValue({
    //       cloudinaryId : res.public_id,
    //       fileUrl: res.url
    //     })
    //     let data={
    //       distributorName  : this.distributorForm.get('distributorName')?.value,
    //       contactPerson : this.distributorForm.get('contactPerson')?.value,
    //       phoneNumber : this.distributorForm.get('phoneNumber')?.value,
    //       address1 : this.distributorForm.get('address1')?.value,
    //       address2 : this.distributorForm.get('address2')?.value,
    //       state : this.distributorForm.get('state')?.value,
    //       gstNo : this.distributorForm.get('gstNo')?.value,
    //       panNo : this.distributorForm.get('panNo')?.value,
    //       fssaiNo : this.distributorForm.get('fssaiNo')?.value,
    //       status : this.distributorForm.get('status')?.value,
    //       cloudinaryId : this.distributorForm.get('cloudinaryId')?.value,
    //       fileUrl : this.distributorForm.get('fileUrl')?.value
    //     }
    //     this.submit = this.productService.updateDistributor(this.distributorId, data).subscribe((res)=>{
    //       console.log(res)
    //       this._snackBar.open("Distributor updated successfully...","" ,{duration:3000})
    //       this.dialogRef.close();
    //       this.clearControls();
    //     },(error=>{
    //           alert(error.message)
    //         }))
    //   })
    // }else{
      let data={
        distributorName  : this.distributorForm.get('distributorName')?.value,
          contactPerson : this.distributorForm.get('contactPerson')?.value,
          phoneNumber : this.distributorForm.get('phoneNumber')?.value,
          address1 : this.distributorForm.get('address1')?.value,
          address2 : this.distributorForm.get('address2')?.value,
          state : this.distributorForm.get('state')?.value,
          gstNo : this.distributorForm.get('gstNo')?.value,
          panNo : this.distributorForm.get('panNo')?.value,
          fssaiNo : this.distributorForm.get('fssaiNo')?.value,
          status : this.distributorForm.get('status')?.value,
          brokerage : this.distributorForm.get('brokerage')?.value,
          advance : this.distributorForm.get('advance')?.value,
          unloading : this.distributorForm.get('unloading')?.value,
          cloudinaryId : this.distributorForm.get('cloudinaryId')?.value,
          fileUrl : this.distributorForm.get('fileUrl')?.value
      }
      console.log(data);

      this.submit = this.productService.updateDistributor(this.distributorId, data).subscribe((res)=>{
        console.log(res);

        this._snackBar.open("Distributor updated successfully...","" ,{duration:3000})
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
    this.getDistributor();
  }

  clearFileInput() {
    this.imageUrl = '';
  }

  deleteImage(image: any){
    let data = {
      fileUrl: image
    }
    this.productService.getDistributorByFileUrl(data).subscribe((res)=>{
      this.patchData()
    })
  }

  onToggleChange(event: any, id: number) {
    const newValue = event.checked;

    let data = {
      status : newValue
    }
    this.productService.updateDistributorStatus(id, data).subscribe(data=>{
    });
  }
}

