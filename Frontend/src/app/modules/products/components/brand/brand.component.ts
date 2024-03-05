import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { DeleteDialogueComponent } from 'src/app/modules/shared-components/delete-dialogue/delete-dialogue.component';
import { ProductService } from '../../product.service';
import { ManageComponent } from '../manage/manage.component';
import { Brand } from '../../models/brand';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.scss']
})
export class BrandComponent implements OnInit {

  constructor(private fb: FormBuilder,public productService: ProductService, private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    @Optional() public dialogRef: MatDialogRef<BrandComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any
    ){}

  ngOnDestroy() {
    this.brandSubscription?.unsubscribe();
    this.uploadSubscription?.unsubscribe();
    this.submit?.unsubscribe();
    this.brandSub?.unsubscribe();
  }

  brandForm = this.fb.group({
    brandName: ['', Validators.required],
    status : [false ,Validators.required],
    cloudinaryId : [''],
    fileUrl : ['']
  });

  displayedColumns : string[] = ['id','brandName', 'manage']

  addStatus!: string;
  editstatus!: boolean;
  ngOnInit(): void {
    if (this.dialogRef) {
      this.addStatus = this.dialogData?.status;

      this.patchData()
    }
    this.brandForm.get('status')?.setValue(true);
    this.getBrand()
    this.getComplete()
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
    if(!this.brandForm.valid){
      return alert('Please fill the form first')
    }
    if(this.file){
      this.uploadSubscription = this.productService.uploadBrandImage(this.file).subscribe(res=>{
        this.brandForm.patchValue({
          cloudinaryId : res.public_id,
          fileUrl: res.url
        })

        console.log(this.brandForm.getRawValue())
        this.submit = this.productService.addBrand(this.brandForm.getRawValue()).subscribe((response)=>{
          let data = {
            brand: this.brandForm.get('brandName')?.value
          }
          this.dialogRef?.close(data);
          this._snackBar.open("Brand added successfully...","" ,{duration:3000})
          this.clearControls()
        },(error=>{
          alert(error)
        }))
      })

    }else{
      console.log(this.brandForm.getRawValue())
      this.submit = this.productService.addBrand(this.brandForm.getRawValue()).subscribe((response)=>{
        let data = {
          brand: this.brandForm.get('brandName')?.value
        }
        console.log('resp',response)
        this.dialogRef?.close(data);
        this._snackBar.open("Brand added successfully...","" ,{duration:3000})
        this.clearControls()
      },(error=>{
        alert(error)
      }))
    }
  }

  clearControls(){
    this.getComplete()
    this.brandForm.reset()
  }

  brands: Brand[] = [];
  brandSubscription? : Subscription
  dataSource! : MatTableDataSource<any>
  getBrand(){
    this.brandSubscription = this.productService.getPaginatedBrand(this.filterValue, this.currentPage, this.pageSize).subscribe((res:any)=>{
      this.filtered = res.items;
      this.totalItems = res.count;
    })
  }

  brandSub!: Subscription;
  getComplete(){
    this.brandSub = this.productService.getBrand().subscribe((res:any)=>{
      this.brands = res;
    })
  }

  filtered!: any[];
  applyFilter(event: Event): void {
    if((event.target as HTMLInputElement).value.trim() === '') {
      this.getBrand();
    }else{
      
      const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
      this.filtered = this.brands.filter(element =>
        element.brandName.toLowerCase().includes(filterValue)
        || element.id.toString().includes(filterValue)
        || element.status.toString().includes(filterValue)
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
      this.getBrand();
    }
  }

  onInputChange(value: any) {
    this.filterValue = value;
    if (!this.filterValue) {
      this.getBrand();
    }
  }

  delete!: Subscription;
  deleteBrand(id : any){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.delete = this.productService.deleteBrand(id).subscribe((res)=>{
          this.getBrand()
          this._snackBar.open("Brand deleted successfully...","" ,{duration:3000})
        },(error=>{
          this._snackBar.open(error.error.message,"" ,{duration:3000})
        }))
      }
    })
  }

  isEdit = false;
  brandId : any;
  editBrand(id : any){
    const dialogRef = this.dialog.open(BrandComponent, {
      data: { status: "true" , type : "edit", id: id},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getBrand();
    });
  }

  patchData(){
    this.productService.getBrand().subscribe(res=>{
      if(this.dialogData?.type === 'edit'){
        this.editstatus = true
        let brand: any= res.find(x =>x.id == this.dialogData?.id)
        console.log(brand)

        let brandName = brand.brandName;
        let status = brand.status;
        this.imageUrl = brand.fileUrl;
        console.log(this.imageUrl)

        this.brandForm.patchValue({
          brandName : brandName,
          status : status,
        })
        this.brandId = this.dialogData?.id;
      }
    })
  }

  edit!:Subscription;
  editFunction(){
    if(!this.brandForm.valid){
      return alert('Please fill the form first')
    }
    if(this.file){
      let image = {
        fileUrl: this.imageUrl,
      }
      this.uploadSubscription = this.productService.updateBrandImage(this.file, image).subscribe(res=>{
        this.brandForm.patchValue({
          cloudinaryId : res.public_id,
          fileUrl: res.url
        })
        let data={
          brandName  : this.brandForm.get('brandName')?.value,
          status : this.brandForm.get('status')?.value,
          cloudinaryId : this.brandForm.get('cloudinaryId')?.value,
          fileUrl : this.brandForm.get('fileUrl')?.value
        }
        this.submit = this.productService.updateBrand(this.brandId, data).subscribe((res)=>{
          console.log(res)
          this._snackBar.open("Brand updated successfully...","" ,{duration:3000})
          this.dialogRef.close();
          this.clearControls();
        },(error=>{
              alert(error.message)
            }))
      })
    }else{
      let data={
        brandName  : this.brandForm.get('brandName')?.value,
        status : this.brandForm.get('status')?.value,
      }
      this.submit = this.productService.updateBrand(this.brandId, data).subscribe((res)=>{
        this._snackBar.open("Brand updated successfully...","" ,{duration:3000})
        this.dialogRef.close();
        this.clearControls();
      },(error=>{
            alert(error.message)
          }))
    }
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getBrand();
  }

  clearFileInput() {
    this.imageUrl = '';
    this.file = '';
  }

  deleteImage(image: any){
    let data = {
      fileUrl: image
    }
    this.productService.getBrandByFileUrl(data).subscribe((res)=>{

      this.patchData()
    })
  }

  onToggleChange(event: any, id: number) {
    const newValue = event.checked;

    let data = {
      status : newValue
    }
    this.productService.updateBrandStatus(id, data).subscribe(data=>{
      console.log(data);
    });
  }
}

