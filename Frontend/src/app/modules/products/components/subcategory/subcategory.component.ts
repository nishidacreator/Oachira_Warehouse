import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { ManageComponent } from '../manage/manage.component';
import { ProductService } from '../../product.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-subcategory',
  templateUrl: './subcategory.component.html',
  styleUrls: ['./subcategory.component.scss']
})
export class SubcategoryComponent implements OnInit {

  constructor(private fb: FormBuilder,public productService: ProductService, private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    @Optional() public dialogRef: MatDialogRef<SubcategoryComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any
    ){}

  ngOnDestroy() {
    this.scSubscription?.unsubscribe()
    this.catSub?.unsubscribe();
  }

  subCategoryForm = this.fb.group({
    subCategoryName: ['', Validators.required],
    categoryId : ['', Validators.required],
    cloudinaryIdSub : [''],
    fileUrlSub : ['']
  });

  displayedColumns : string[] = ['id','brandName', 'manage']

  addStatus!: string
  ngOnInit(): void {
    if (this.dialogRef) {
      this.addStatus = this.dialogData?.status;
    }

    this.getSubCategory()
    this.getCategory()
  }

  categories: any[] = [];
  catSub!: Subscription;
  getCategory(){
    this.catSub = this.productService.getCategory().subscribe((category) => {
      this.categories = category
    })
  }

  addCategory(){

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
    this.uploadSubscription = this.productService.uploadSubCategoryImage(this.file).subscribe(res=>{
      this.subCategoryForm.patchValue({
        cloudinaryIdSub : res.public_id,
        fileUrlSub : res.url
      })
      console.log(this.subCategoryForm.getRawValue())
      this.submit = this.productService.addSubCategory(this.subCategoryForm.getRawValue()).subscribe((res)=>{
        console.log(res);
        this._snackBar.open("SubCategory added successfully...","" ,{duration:3000})
        this.getSubCategory()
        this.clearControls()
      },(error=>{
        alert(error)
      }))
    })
  }

  clearControls(){
    this.subCategoryForm.reset()
    this.subCategoryForm.setErrors(null)
    Object.keys(this.subCategoryForm.controls).forEach(key=>{this.subCategoryForm.get(key)?.setErrors(null)})
    this.file = null;
    this.imageUrl = '';

  }

  brands: any[] = [];
  scSubscription? : Subscription
  dataSource! : MatTableDataSource<any>
  getSubCategory(){
    this.scSubscription = this.productService.getPaginatedSubCategory(this.filterValue, this.currentPage, this.pageSize).subscribe((res:any)=>{
      this.brands = res.items;
        this.totalItems = res.count;
    })
  }

  isImageEnlarged = false;
  enlargeImage(enlarge: boolean): void {
    this.isImageEnlarged = enlarge;
  }

  pageSize = 10;
  currentPage = 1;
  totalItems = 0;
  filterValue = "";
  search() {
    if (this.filterValue) {
      this.getSubCategory();
    }
  }

  onInputChange(value: any) {
    // this.filterValue = value;
    // if (!this.filterValue) {
    //   this.getSubCategory();
    // }
  }

  delete!: Subscription;
  deleteBrand(id : any){
    // const dialogRef = this.dialog.open(DeleteDialogueComponent, {
    //   data: {}
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result === true) {
    //     this.delete = this.adminService.deleteBrand(id).subscribe((res)=>{
    //       this.getSubCategory()
    //       this._snackBar.open("Brand deleted successfully...","" ,{duration:3000})
    //     },(error=>{
    //       this._snackBar.open(error.error.message,"" ,{duration:3000})
    //     }))
    //   }
    // })
  }

  isEdit = false;
  brandId : any;
  editBrand(id : any){
    // this.isEdit = true;
    // //Get the product based on the ID
    // let brand: any= this.brands.find(x =>x.id == id)

    // //Populate the object by the ID
    // let brandName = brand.brandName.toString();

    // this.subCategoryForm.patchValue({brandName : brandName})
    // this.brandId = id;
  }

  edit!:Subscription;
  editFunction(){
    // this.isEdit = false;

    // let data: any ={
    //   brandName : this.subCategoryForm.get('brandName')?.value
    // }

    // this.edit = this.adminService.updateBrand(this.brandId, data).subscribe((res)=>{
    //   this._snackBar.open("Brand updated successfully...","" ,{duration:3000})
    //   this.getSubCategory();
    //   this.clearControls();
    // },(error=>{
    //       alert(error.message)
    //     }))
  }

  homeClick(){
    const dialogRef = this.dialog.open(ManageComponent, {
      height: '200px',
      width: '800px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    })
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  onPageChange(event: PageEvent): void {
    // this.currentPage = event.pageIndex + 1;
    // this.pageSize = event.pageSize;
    // this.getSubCategory();
  }


}
