import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { ManageComponent } from '../manage/manage.component';
import { ProductService } from '../../product.service';
import { MatTableDataSource } from '@angular/material/table';
import { SubCategory } from '../../models/sub-category';
import { DeleteDialogueComponent } from 'src/app/modules/shared-components/delete-dialogue/delete-dialogue.component';
import { Category } from '../../models/category';
import { CategoryComponent } from '../category/category.component';

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
    this.uploadSubscription?.unsubscribe();
    this.submit?.unsubscribe();
    this.scSub?.unsubscribe();
    this.deleteSub?.unsubscribe();
    this.getSubCatSub?.unsubscribe();
    this.delete?.unsubscribe();
  }

  subCategoryForm = this.fb.group({
    subCategoryName: ['', Validators.required],
    categoryId : ['', Validators.required],
    cloudinaryIdSub : [''],
    fileUrlSub : [''],
    status: [false],
  });

  displayedColumns : string[] = ['id','brandName', 'manage']

  addStatus!: string;
  editstatus!: boolean;
  subCategoryId!: number;
  ngOnInit(): void {
    this.subCategoryForm.get('status')?.setValue(true);

    if (this.dialogRef) {
      this.addStatus = this.dialogData?.status;
      if(this.dialogData?.category){
        this.subCategoryForm.get('categoryId')?.setValue(this.dialogData.category)
      }
      this.patchData()
    }

    this.getSubCategory()
    this.getCategory()
    this.getComplete()
  }

  categories: any[] = [];
  catSub!: Subscription;
  getCategory(value? : string){
    this.catSub = this.productService.getCategory().subscribe((category) => {
      this.categories = category
      this.filteredCat = this.categories
      if(value){
        this.filterCategory(value)
      }
    })
  }

  addCategory(){
    const dialogRef = this.dialog.open(CategoryComponent, {
      data: { status: "true" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getCategory(result?.category);
    });
  }

  myControl = new FormControl<string | Category>("");
  filteredCat: Category[] = [];
  filterCategory(event: Event | string) {
    let value: string = "";

    if (typeof event === "string") {
      value = event;
    } else if (event instanceof Event) {
      value = (event.target as HTMLInputElement).value;
    }
    this.filteredCat = this.categories.filter((option) => {
      if (
        (option.categoryName &&
          option.categoryName.toLowerCase().includes(value?.toLowerCase()))
      ) {
        return true;
      } else {
        return null;
      }
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

  submit!: Subscription
  uploadSubscription!: Subscription;
  onSubmit(){
    if(!this.subCategoryForm.valid){
      return alert('Please fill the form first')
    }
    if(this.file){
      this.uploadSubscription = this.productService.uploadCategoryImage(this.file).subscribe(res=>{
        this.subCategoryForm.patchValue({
          cloudinaryIdSub : res.public_id,
          fileUrlSub: res.url
        })
        this.submit = this.productService.addSubCategory(this.subCategoryForm.getRawValue()).subscribe((response)=>{
          let data = {
            subCat: this.subCategoryForm.get('subCategoryName')?.value
          }
          this.dialogRef?.close(data);
          this._snackBar.open("SubCategory added successfully...","" ,{duration:3000})
          this.clearControls()
        },(error=>{
          alert(error)
        }))
      })

    }else{
      this.submit = this.productService.addSubCategory(this.subCategoryForm.getRawValue()).subscribe((response)=>{
        let data = {
          subCat: this.subCategoryForm.get('subCategoryName')?.value
        }
        this.dialogRef?.close(data);
        this._snackBar.open("SubCategory added successfully...","" ,{duration:3000})
        this.clearControls()
      },(error=>{
        alert(error)
      }))
    }
  }

  clearControls(){
    this.getComplete()
    this.subCategoryForm.reset()
    this.file = null;
    this.imageUrl = '';

  }

  subCategories: SubCategory[] = [];
  scSubscription? : Subscription
  dataSource! : MatTableDataSource<any>
  getSubCategory(){
    this.scSubscription = this.productService.getPaginatedSubCategory(this.filterValue, this.currentPage, this.pageSize).subscribe((res:any)=>{
      this.filtered = res.items;
      this.totalItems = res.count;
    })
  }

  scSub!: Subscription;
  getComplete(){
    this.scSub = this.productService.getSubCategory().subscribe((res:any)=>{
      this.subCategories = res;
    })
  }

  filtered!: any[];
  applyFilter(event: Event): void {
    if((event.target as HTMLInputElement).value.trim() === '') {
      this.getSubCategory();
    }else{
      const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
      this.filtered = this.subCategories.filter(element =>
        element.subCategoryName.toLowerCase().includes(filterValue)
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
      this.getSubCategory();
    }
  }

  onInputChange(value: any) {
    this.filterValue = value;
    if (!this.filterValue) {
      this.getSubCategory();
    }
  }

  delete!: Subscription;
  deleteSubCategory(id : any){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.delete = this.productService.deleteSubCategory(id).subscribe((res)=>{
          this.getSubCategory()
          this._snackBar.open("SubCategory deleted successfully...","" ,{duration:3000})
        },(error=>{
          this._snackBar.open(error.error.message,"" ,{duration:3000})
        }))
      }
    })
  }

  isEdit = false;
  brandId : any;
  editSubCategory(id : any){
    this.isEdit = true;
    const dialogRef = this.dialog.open(SubcategoryComponent, {
      data: { status: "true" , type : "edit", id: id},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getSubCategory();
    });
  }

  getSubCatSub!: Subscription;
  patchData(){
    this.getSubCatSub = this.productService.getSubCategory().subscribe(res=>{
      if(this.dialogData?.type === 'edit'){
        this.editstatus = true
        let category: any= res.find(x =>x.id == this.dialogData?.id)
        console.log(category)

        let subCategoryName = category.subCategoryName;
        let categoryId = category.category.id;
        let status = category.status;
        this.imageUrl = category.fileUrlSub;
        console.log(this.imageUrl)

        this.subCategoryForm.patchValue({
          subCategoryName : subCategoryName,
          categoryId : categoryId,
          status : status
        })
        this.subCategoryId = this.dialogData?.id;
      }
    })
  }

  edit!:Subscription;
  editFunction(){
    if(!this.subCategoryForm.valid){
      return alert('Please fill the form first')
    }
    if(this.file){
      let image = {
        fileUrl: this.imageUrl,
      }
      this.uploadSubscription = this.productService.updateSubCategoryImage(this.file, image).subscribe(res=>{
        this.subCategoryForm.patchValue({
          cloudinaryIdSub : res.public_id,
          fileUrlSub: res.url
        })
        let data={
          subCategoryName  : this.subCategoryForm.get('subCategoryName')?.value,
          categoryId : this.subCategoryForm.get('categoryId')?.value,
          cloudinaryIdSub : this.subCategoryForm.get('cloudinaryIdSub')?.value,
          fileUrlSub : this.subCategoryForm.get('fileUrlSub')?.value,
          status: this.subCategoryForm.get('status')?.value
        }
        this.submit = this.productService.updateSubCategory(this.subCategoryId, data).subscribe((res)=>{
          console.log(res)
          this._snackBar.open("SubCategory updated successfully...","" ,{duration:3000})
          this.dialogRef.close();
          this.clearControls();
        },(error=>{
              alert(error.message)
            }))
      })
    }else{
      let data={
        subCategoryName  : this.subCategoryForm.get('subCategoryName')?.value,
        categoryId : this.subCategoryForm.get('categoryId')?.value,
        status: this.subCategoryForm.get('status')?.value
      }
      this.submit = this.productService.updateSubCategory(this.subCategoryId, data).subscribe((res)=>{
        this._snackBar.open("SubCategory updated successfully...","" ,{duration:3000})
        this.dialogRef.close();
        this.clearControls();
      },(error=>{
            alert(error.message)
          }))
    }
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
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getSubCategory();
  }

  clearFileInput() {
    this.imageUrl = '';
    this.file = ''
  }

  deleteSub!: Subscription;
  deleteImage(image: any){
    let data = {
      fileUrl: image
    }
    this.deleteSub = this.productService.getSubCategoryByFileUrl(data).subscribe((res)=>{
      console.log(res)
      this.dialogRef.close();
    })
  }

  onToggleChange(event: any, id: number) {
    const newValue = event.checked;

    let data = {
      status : newValue
    }
    this.productService.updateSubCategoryStatus(id, data).subscribe(data=>{
      console.log(data);
    });
  }
}
