import { Component, ElementRef, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { DeleteDialogueComponent } from 'src/app/modules/shared-components/delete-dialogue/delete-dialogue.component';
import { ManageComponent } from '../manage/manage.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from '../../product.service';
import { dataBound } from '@syncfusion/ej2-angular-grids';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  ngOnDestroy(){
    this.submitSubscription?.unsubscribe();
    this.uploadSub?.unsubscribe();
    this.uploadSubscription?.unsubscribe();
    this.categorySubscription?.unsubscribe();
    this.catSub?.unsubscribe();
  }

  constructor(private fb: FormBuilder, private _snackBar: MatSnackBar, private productService: ProductService,
    public dialog: MatDialog, @Optional() public dialogRef: MatDialogRef<CategoryComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any
  ){}

  productCategoryForm = this.fb.group({
    url: [''],
    categoryName: ['', Validators.required],
    taxable: [false],
    cloudinaryId : [''],
    fileUrl : [''],
    status: [false],
    subCategories: this.fb.array([])
  });

  subCategories(): FormArray {
    return this.productCategoryForm.get("subCategories") as FormArray;
  }

  newSubCategory(): FormGroup {
    return this.fb.group({
      subCategoryName: [''],
      status: [''],
      cloudinaryIdSub : [''],
      fileUrlSub : [''],
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

  addStatus!: string;
  editstatus: boolean = false;
  ngOnInit(): void {
    this.getCategory();
    this.getComplete();
    this.productCategoryForm.get('status')?.setValue(true);

    if (this.dialogRef) {
      this.addStatus = this.dialogData?.status;
      this.patchData()
    }
  }

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

  clearFileInput() {
    this.imageUrl = '';
    this.file = '';
  }

  fileSub!: any;
  urlSub!: any;
  uploadStatusSub = false
  imageUrlSub: any[] = [];
  uploadSub!: Subscription;
  onFileSelectedSub(event: any, i: number){
    if(event.target.files.length > 0){
      this.uploadStatusSub = true
      this.fileSub = event.target.files[0]
      let fileType = this.file? this.file.type : '';

      if (this.fileSub) {
        try {
            // You can read the selected file and display it as an image.
          const reader = new FileReader();
          console.log(reader);
          reader.onload = (event: any) => {
            this.imageUrlSub.push(event.target.result as string);
          };
          reader.readAsDataURL(this.fileSub);
        } catch (error) {
          console.log(error);
        }

        this.uploadSub = this.productService.uploadSubCategoryImage(this.fileSub).subscribe(res=>{
          console.log('uploadresponse', res)
          this.subCategories().at(i).patchValue({
            cloudinaryIdSub : res.public_id,
            fileUrlSub: res.url
          })
          console.log(this.productCategoryForm.getRawValue())
        })
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

  submitSubscription!: Subscription
  uploadSubscription!: Subscription
  onSubmit(){
    if(!this.productCategoryForm.valid){
      return alert('Please fill the form first')
    }
    if(this.file){
      this.uploadSubscription = this.productService.uploadCategoryImage(this.file).subscribe(res=>{
        this.productCategoryForm.patchValue({
          cloudinaryId : res.public_id,
          fileUrl: res.url
        })
        this.submitSubscription = this.productService.addCategory(this.productCategoryForm.getRawValue()).subscribe((response)=>{
          let data = {
            category: this.productCategoryForm.get('categoryName')?.value
          }
          this.dialogRef?.close(data);
          this._snackBar.open("Category added successfully...","" ,{duration:3000})
          this.clearControls()
        },(error=>{
          alert(error)
        }))
      })

    }else{
      this.submitSubscription = this.productService.addCategory(this.productCategoryForm.getRawValue()).subscribe((response)=>{

        let data = {
          category: this.productCategoryForm.get('categoryName')?.value
        }
        this.dialogRef?.close(data);
        this._snackBar.open("Category added successfully...","" ,{duration:3000})
        this.clearControls()
      },(error=>{
        alert(error)
      }))
    }

  }

  clearControls(){
    this.getComplete()
    this.productCategoryForm.reset()
    this.file = null;
    this.fileSub = null;
    this.imageUrl = '';
    this.imageUrlSub = [ ]
  }

  category: any [] = [];
  categorySubscription? : Subscription
  getCategory(){
    this.categorySubscription = this.productService.getPaginatedCategory(this.filterValue, this.currentPage, this.pageSize).subscribe((res:any)=>{
      this.filtered = res.items;
      this.totalItems = res.count;
    })
  }

  catSub!: Subscription;
  getComplete(){
    this.catSub = this.productService.getCategory().subscribe((res:any)=>{
      this.category = res;
    })
  }

  filtered!: any[];
  applyFilter(event: Event): void {
    if((event.target as HTMLInputElement).value.trim() === '') {
      this.getCategory();
    }else{
      const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
      this.filtered = this.category.filter(element =>
        element.categoryName.toLowerCase().includes(filterValue)
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
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.productService.deleteCategory(id).subscribe((res)=>{
          this.getCategory()
          this._snackBar.open("Category deleted successfully...","" ,{duration:3000})
        },(error=>{
          this._snackBar.open(error.error.message,"" ,{duration:3000})
        }))
      }
    })
  }

  isEdit = false
  categoryId : any;
  editCategory(id:any){
    this.isEdit = true;
    const dialogRef = this.dialog.open(CategoryComponent, {
      data: { status: "true" , type : "edit", id: id},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getCategory();
    });

  }

  editSub!: Subscription;
  patchData(){
    this.editSub = this.productService.getCategory().subscribe(res=>{
      console.log(res);

      if(this.dialogData?.type === 'edit'){
        this.editstatus = true
        let category: any= res.find(x =>x.id == this.dialogData?.id)
        console.log(category);

        let categoryName = category.categoryName;
        let taxable = category.taxable;
        let status = category.status;
        this.imageUrl = category.fileUrl;

        this.productCategoryForm.patchValue({
          categoryName : categoryName,
          taxable : taxable,
          status : status
        })
        this.categoryId = this.dialogData?.id;
      }
    })
  }

  editFunction(){
    if(!this.productCategoryForm.valid){
      return alert('Please fill the form first')
    }
    if(this.file){
      let image = {
        fileUrl: this.imageUrl,
      }
      this.uploadSubscription = this.productService.updateCategoryImage(this.file, image).subscribe(res=>{
        this.productCategoryForm.patchValue({
          cloudinaryId : res.public_id,
          fileUrl: res.url
        })
        let data={
          categoryName  : this.productCategoryForm.get('categoryName')?.value,
          taxable : this.productCategoryForm.get('taxable')?.value,
          cloudinaryId : this.productCategoryForm.get('cloudinaryId')?.value,
          fileUrl : this.productCategoryForm.get('fileUrl')?.value
        }
        this.submitSubscription = this.productService.updateCategory(this.categoryId,data).subscribe((res)=>{
          this._snackBar.open("Category updated successfully...","" ,{duration:3000})
          this.dialogRef.close();
          this.clearControls();
        },(error=>{
              alert(error.message)
            }))
      })
    }else{
      let data={
        categoryName  : this.productCategoryForm.get('categoryName')?.value,
        taxable : this.productCategoryForm.get('taxable')?.value
      }
      this.submitSubscription = this.productService.updateCategory(this.categoryId, data).subscribe((res)=>{
        this._snackBar.open("Category updated successfully...","" ,{duration:3000})
        this.dialogRef.close();
        this.clearControls();
      },(error=>{
            alert(error.message)
          }))
    }
  }

  deleteImage(image: any){
    console.log("image");

    let data = {
      fileUrl: image
    }
    console.log(data)
    this.productService.getCategoryByFileUrl(data).subscribe((res)=>{
      console.log(res)
      this.dialogRef.close();
    })
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

  onToggleChange(event: any, id: number) {
    const newValue = event.checked;

    let data = {
      status : newValue
    }
    this.productService.updateCategoryStatus(id, data).subscribe(data=>{
      console.log(data);
    });
  }

}
