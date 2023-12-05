import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { DeleteDialogueComponent } from 'src/app/modules/shared-components/delete-dialogue/delete-dialogue.component';
import { ManageComponent } from '../manage/manage.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  constructor(private fb: FormBuilder, private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    @Optional() public dialogRef: MatDialogRef<CategoryComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any
  ){}

  productCategoryForm = this.fb.group({
    url: [''],
    categoryName: ['', Validators.required],
    taxable: [false],
    cloudinary_id : [''],
    file_url : [''],
    subCategories: this.fb.array([])
  });

  subCategories(): FormArray {
    return this.productCategoryForm.get("subCategories") as FormArray;
  }

  newSubCategory(): FormGroup {
    return this.fb.group({
      qualification: ['']
    });
  }

  status: boolean = false;
  addSubCategory() {
    this.status = true;
    this.subCategories().push(this.newSubCategory());
  }

  removeSubCategory(i: number) {
    this.subCategories().removeAt(i);
  }

  addStatus!: string
  ngOnInit(): void {
    // this.categorySubscription = this.getCategory();

    if (this.dialogRef) {
      this.addStatus = this.dialogData?.status;
    }
  }
  // openImagePopup(imageUrl: string): void {
  //   this.selectedImageUrl = imageUrl;
  //   this.showImagePopup = true;
  // }

  // closeImagePopup(): void {
  //   this.showImagePopup = false;
  // }


  displayedColumns : string[] = ['categoryImage','categoryName', 'taxable', 'manage']

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

  onUpload(){
    this.uploadStatus = false
    // this.adminService.uploadCategoryImage(this.file).subscribe(res=>{
    //   console.log('uploadresponse'+res)
    //   this.productCategoryForm.patchValue({
    //     cloudinary_id : res.public_id,
    //     file_url: res.url
    //   })
    //   console.log(this.productCategoryForm.getRawValue())
    // })
  }

  private submitSubscription : Subscription = new Subscription();
  onSubmit(){
    this.uploadStatus = false
    // this.adminService.uploadCategoryImage(this.file).subscribe(res=>{
    //   console.log('uploadresponse'+res)
    //   this.productCategoryForm.patchValue({
    //     cloudinary_id : res.public_id,
    //     file_url: res.url
    //   })
    //   console.log(this.productCategoryForm.getRawValue())
    //   this.submitSubscription = this.adminService.addCategory(this.productCategoryForm.getRawValue()).subscribe((res)=>{
    //     this._snackBar.open("Category added successfully...","" ,{duration:3000})
    //     this.clearControls()
    //   },(error=>{
    //     alert(error)
    //   }))
    // })
  }

  clearControls(){
    this.getCategory()
    this.productCategoryForm.reset()
    this.productCategoryForm.setErrors(null)
    Object.keys(this.productCategoryForm.controls).forEach(key=>{this.productCategoryForm.get(key)?.setErrors(null)})
  }

  category: any [] = [];
  categorySubscription? : Subscription
  getCategory(){
    // return this.adminService.getPaginatedCategory(this.filterValue, this.currentPage, this.pageSize).subscribe((res:any)=>{
    //   this.category = res.items;
    //   console.log(this.category)
    //   this.totalItems = res.count;
    // })
  }

  pageSize = 10;
  currentPage = 1;
  totalItems = 0;

  filterValue = "";
  search() {
    if (this.filterValue) {
      this.getCategory();
    }
  }

  onInputChange(value: any) {
    this.filterValue = value;
    if (!this.filterValue) {
      this.getCategory();
    }
  }


  deleteCategory(id:any){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      width: '250px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        // this.adminService.deleteCategory(id).subscribe((res)=>{
        //   this.getCategory()
        //   this._snackBar.open("Category deleted successfully...","" ,{duration:3000})
        // },(error=>{
        //   this._snackBar.open(error.error.message,"" ,{duration:3000})
        // }))
      }
    })
  }

  isEdit = false
  categoryId : any;
  editCategory(id:any){
    this.isEdit=true;

    let category: any= this.category.find(x =>x.id == id)
    console.log(category)
    debugger;

    let categoryName = category.categoryName.toString();
    let taxable = category.taxable.toString();
    let category_image = category.category_image;

    // let reader: any = new FileReader();
    //     reader.readAsDataURL(category_image)
    //     reader.onload = (event: any) =>{
    //       this.url = event.target.result;
    //     }
    // console.log(category_image)

    this.productCategoryForm.patchValue({
      categoryName : categoryName,
      taxable : taxable
    })
    this.categoryId = id;
    // this.productCategoryForm.get('category_image')?.setValue(category_image);
  }

  editFunction(){
    let data={
      categoryName  : this.productCategoryForm.get('categoryName')?.value,
      taxable : this.productCategoryForm.get('taxable')?.value,
      category_image : this.productCategoryForm.get('category_image')?.value
    }
    // if (this.selectedImageUrl) {
    //   this.uploadImageAndSubmit(data);
    // } else {
    //   this.submitCategoryData(data);
    // }
    // this.adminService.updateCategory(this.categoryId,data).subscribe((res)=>{
    //   this.clearControls();
    // },(error=>{
    //       alert(error.message)
    //     }))
  }
  uploadImageAndSubmit(data: any) {
    // Upload the new image using your image upload service (e.g., Cloudinary)
    // After successful upload, update the data object with the new image URL
    // data.categoryImage = uploadedImageUrl;

    this.submitCategoryData(data);
  }

  // Submit the category data
  submitCategoryData(data: any) {
    // this.adminService.updateCategory(this.categoryId, data).subscribe(
    //   (res) => {
    //     this.clearControls();
    //   },
    //   (error) => {
    //     alert(error.message);
    //   }
    // );
  }



  // onUpload(){
  //     const formData = new FormData();
  //     formData.append('categoryImage', this.file, this.file.name);
  //     console.log(formData)
  //   // this.adminService.uploadImage(this.file).subscribe(res=>{
  //   //   console.log(res)
  //   // })
  // }

  homeClick(){
    const dialogRef = this.dialog.open(ManageComponent, {
      height: '200px',
      width: '800px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    })
  }


  showImagePopup= false;

  showPopup() {
    this.showImagePopup = true;
  }

  hidePopup() {
    this.showImagePopup = false;
  }


  onCancelClick(): void {
    this.dialogRef.close();
  }

 @ViewChild(MatPaginator) paginator!: MatPaginator;

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getCategory();
  }

}
