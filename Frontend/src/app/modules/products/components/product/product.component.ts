import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { DeleteDialogueComponent } from 'src/app/modules/shared-components/delete-dialogue/delete-dialogue.component';
import { Product } from '../../models/product';
import { ProductService } from '../../product.service';
import { SubCategory } from '../../models/sub-category';
import { ManageComponent } from '../manage/manage.component';
import { SubcategoryComponent } from '../subcategory/subcategory.component';
import { Brand } from '../../models/brand';
import { Location } from '../../models/location';
import { Category } from '../../models/category';
import { CategoryComponent } from '../category/category.component';
import { LocationComponent } from '../location/location.component';
import { BrandComponent } from '../brand/brand.component';
import { Hsn } from '../../models/hsn';
import { HsnComponent } from '../hsn/hsn.component';
import { Gst } from '../../models/gst';
import { GstComponent } from '../gst/gst.component';
import { PrimaryUnit } from '../../models/primary-unit';
import { UnitComponent } from '../unit/unit.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  constructor(private fb: FormBuilder,public productService: ProductService, private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    @Optional() public dialogRef: MatDialogRef<SubcategoryComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any
    ){}

  ngOnDestroy() {
    this.brandSub?.unsubscribe();
    this.unitSub?.unsubscribe();
    this.cSubscription?.unsubscribe();
    this.scSubscription?.unsubscribe();
    this.locSub?.unsubscribe();
    this.gstSub?.unsubscribe();
    this.hsnSub?.unsubscribe();
    this.submit?.unsubscribe();
    this.uploadSubscription?.unsubscribe();
    this.prodSub?.unsubscribe();
    this.productsSub?.unsubscribe();
    this.delete?.unsubscribe();
    this.imageSub?.unsubscribe();
    this.patchSub?.unsubscribe();
  }

  productForm = this.fb.group({
    productName : ['', Validators.required],
    code : [''],
    barCode : [''],
    categoryId : [],
    subCategoryId : [],
    baseUnitId : [],
    brandId : [],
    locationId : [],
    gstId : [],
    hsnId : [],
    reorderQuantity : [],
    warehouseLoyalityPoint:[],
     retailLoyalityPoint:[],
     isSpecial:[],
     openingStock:[],
     brokerageItem :[],
     isRouteItem:[],
     primaryUnitId:[],
    loyaltyPoint : [],
    status : [false],

    cloudinaryId : [''],
    fileUrl : ['']

  });

  displayedColumns : string[] = ['id','brandName', 'manage']

  addStatus!: string;
  editstatus!: boolean;
  productId!: number;
  ngOnInit(): void {
    this.getPrimaryUnit()
    this.productForm.get('status')?.setValue(true);

    if (this.dialogRef) {
      this.addStatus = this.dialogData?.status;
      this.patchData()
    }

    this.getBrands();
    this.getLocation();
    this.getSubCategory()
    this.getProduct()
    this.getCategory();
    this.getComplete();
    this.getHsn();
    this.getGst();
    this.getPUnit();
  }

  categories: Category[] = [];
  cSubscription? : Subscription
  getCategory(value?: string){
    this.cSubscription = this.productService.getCategory().subscribe((res:any)=>{
      this.categories = res;
      console.log(this.categories);

      this.filteredCat = this.categories
      if(value){
        this.filterCategory(value);
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

  subCategories: SubCategory[] = [];
  scSubscription? : Subscription
  getSubCategory(value?: string){
    this.scSubscription = this.productService.getSubCategory().subscribe((res:any)=>{
      this.subCategories = res;
      this.filteredSubCat = res;
      this.filtSub = res;
      if(value){
        this.filterSubCategory(value);
      }
    })
  }

  primaryUnit : PrimaryUnit []=[]
  psubscription? : Subscription

  getPrimaryUnit(){
    this.psubscription = this.productService.getPrimaryUnit().subscribe((res:any)=>{
      this.primaryUnit = res;

    })

  }

  filtSub: SubCategory[] = [];
  getSubByCat(id: number){
    this.filtSub = this.subCategories.filter(c=>c.categoryId === id)
    this.filteredSubCat = this.filtSub
  }

  addSubCategory(){
    const dialogRef = this.dialog.open(SubcategoryComponent, {
      data: { status: "true", category: this.productForm.get('categoryId')?.value },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getSubCategory(result?.subCat);
    });
  }

addPrimaryUnit(){

  const dialogRef = this.dialog.open(UnitComponent, {

  });

  dialogRef.afterClosed().subscribe((result) => {

  });

}

  mySubCat = new FormControl<string | SubCategory>("");
  filteredSubCat: SubCategory[] = [];
  filterSubCategory(event: Event | string) {
    let value: string = "";

    if (typeof event === "string") {
      value = event;
    } else if (event instanceof Event) {
      value = (event.target as HTMLInputElement).value;
    }
    this.filteredSubCat = this.filtSub.filter((option) => {
      if (
        (option.subCategoryName &&
          option.subCategoryName.toLowerCase().includes(value?.toLowerCase()))
      ) {
        return true;
      } else {
        return null;
      }
    });
  }

  locations!: Location[];
  locSub!: Subscription;
  getLocation(value?: string){
    this.locSub = this.productService.getLocation().subscribe((category) => {
      this.locations = category
      this.filteredLoc = this.locations
      if(value){
        this.filterLocation(value)
      }
    })
  }

  addLocation(){
    const dialogRef = this.dialog.open(LocationComponent, {
      data: { status: "true" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getLocation(result?.location);
    });
  }

  myLoc = new FormControl<string | Location>("");
  filteredLoc: Location[] = [];
  filterLocation(event: Event | string) {
    let value: string = "";

    if (typeof event === "string") {
      value = event;
    } else if (event instanceof Event) {
      value = (event.target as HTMLInputElement).value;
    }
    this.filteredLoc = this.locations.filter((option) => {
      if (
        (option.locationName &&
          option.locationName.toLowerCase().includes(value?.toLowerCase()))
       ) {
        return true;
      } else {
        return null;
      }
    });
  }

  brands: Brand[] = [];
  brandSub!: Subscription;
  getBrands(value?: string){
    this.brandSub = this.productService.getBrand().subscribe(brands =>{
      this.brands = brands
      this.filteredBrand = this.brands
      if(value){
        this.filterBrand(value);
      }
    })
  }

  addBrand(){
    const dialogRef = this.dialog.open(BrandComponent, {
      data: { status: "true" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getBrands(result?.brand);
    });
  }

  myBrand = new FormControl<string | Brand>("");
  filteredBrand: Brand[] = [];
  filterBrand(event: Event|string) {
    let value: string = "";

    if (typeof event === "string") {
      value = event;
    } else if (event instanceof Event) {
      value = (event.target as HTMLInputElement).value;
    }
    this.filteredBrand = this.brands.filter((option) => {
      if (
        (option.brandName &&
          option.brandName.toLowerCase().includes(value?.toLowerCase()))
      ) {
        return true;
      } else {
        return null;
      }
    });
  }

  units: PrimaryUnit[] = [];
  unitSub!: Subscription;
  getPUnit(value?: string){
    this.unitSub = this.productService.getPrimaryUnit().subscribe(x =>{
      this.units = x
      this.filteredUnits = this.units
      if(value){
        this.filterBrand(value);
      }
    })
  }

  addUnit(){
    const dialogRef = this.dialog.open(UnitComponent, {
      data: { status: "add", type : "add", unit: "primary" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getPUnit(result?.brand);
    });
  }

  filteredUnits: PrimaryUnit[] = [];
  filterUnit(event: Event|string) {
    let value: string = "";

    if (typeof event === "string") {
      value = event;
    } else if (event instanceof Event) {
      value = (event.target as HTMLInputElement).value;
    }
    this.filteredUnits = this.units.filter((option) => {
      if (
        (option.primaryUnitName &&
          option.primaryUnitName.toLowerCase().includes(value?.toLowerCase()))
      ) {
        return true;
      } else {
        return null;
      }
    });
  }

  gst: Gst[] = [];
  gstSub!: Subscription;
  getGst(value?: string){
    this.productService.getGst().subscribe(x =>{
      this.gst = x
      this.filteredGst = this.gst
      if(value){
        this.filterGst(value)
      }
    })
  }

  addGst(){
    const dialogRef = this.dialog.open(GstComponent, {
      data: { status: "true" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getGst(result?.gst)
    });
  }

  myGst = new FormControl<string | Gst>("");
  filteredGst: Gst[] = [];

  filterGst(event?: Event | string) {
    let value: string = "";

    if (typeof event === "string") {
      value = event;
    } else if (event instanceof Event) {
      value = (event.target as HTMLInputElement).value;
    }
    this.filteredGst = this.gst.filter((option) => {
      if (
        (option.gstName &&
          option.gstName.toLowerCase().includes(value.toLowerCase()))
      ) {
        return true;
      } else {
        return null;
      }
    });
    console.log(this.filteredGst)
  }


  hsn: Hsn[] = [];
  hsnSub!: Subscription;
  getHsn(value?:string){
    this.productService.getHsn().subscribe(c =>{
      console.log(c);
      this.hsn = c
      this.filteredHsn = this.hsn
      if(value){
        this.filterHsn(value)
      }
    })
  }

  addHsn(){
    const dialogRef = this.dialog.open(HsnComponent, {
      data: { status: "true" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getHsn(result?.hsn);
    });
  }

  myHsn = new FormControl<string | Hsn>("");
  filteredHsn: Hsn[] = [];
  filterHsn(event?: Event | string) {
    let value: string = "";

    if (typeof event === "string") {
      value = event;
    } else if (event instanceof Event) {
      value = (event.target as HTMLInputElement).value;
    }
    this.filteredHsn = this.hsn.filter((option) => {
      if (
        (option.hsnName &&
          option.hsnName.toLowerCase().includes(value?.toLowerCase()))
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
    if(!this.productForm.valid){
      return alert('Please fill the form first')
    }
    if(this.file){
      this.uploadSubscription = this.productService.uploadProductImage(this.file).subscribe(res=>{
        this.productForm.patchValue({
          cloudinaryId : res.public_id,
          fileUrl: res.url
        })

        this.submit = this.productService.addProduct(this.productForm.getRawValue()).subscribe((response)=>{
          let data = {
            product: res
          }
          this.dialogRef?.close(data);
          this._snackBar.open("Product added successfully...","" ,{duration:3000})
          this.clearControls()
        },(error=>{
          alert(error)
        }))
      })

    }else{
      this.submit = this.productService.addProduct(this.productForm.getRawValue()).subscribe((response)=>{
        let data = {
          product: this.productForm.get('productName')?.value
        }
        this.dialogRef?.close(data);
        this._snackBar.open("Product  added successfully...","" ,{duration:3000})
        this.clearControls()
      },(error=>{
        alert(error)
      }))
    }
  }

  products: Product[] = [];
  prodSub!: Subscription;
  getProduct(){
    this.prodSub = this.productService.getPaginatedProduct(this.filterValue, this.currentPage, this.pageSize)
      .subscribe((data: any) => {
        // this.products = data.items; // Adjust according to your API response structure
        this.filtered = data.items;
        console.log(this.filtered);
        this.totalItems = data.count;
      });
  }

  productsSub!: Subscription;
  getComplete(){
    this.productsSub = this.productService.getProduct().subscribe(data=>{
      this.products = data
    })
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageSize = 10;
  currentPage = 1;
  totalItems = 0;
  filterValue = "";
  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getProduct();
  }

  // filterValue: any;
  filtered!: any[];
  applyFilter(event: Event): void {
    if((event.target as HTMLInputElement).value.trim() === '') {
      this.getProduct();
    }else{
      const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
      this.filtered = this.products.filter(element =>
        element.productName.toLowerCase().includes(filterValue)
        || element.id.toString().includes(filterValue)
        || element.status.toString().includes(filterValue)
    );
    }
  }

  clearControls(){
    this.productForm.reset()
    this.productForm.setErrors(null)
    Object.keys(this.productForm.controls).forEach(key=>{this.productForm.get(key)?.setErrors(null)})
    this.file = null;
    this.imageUrl = '';
    this.getProduct()
  }

  isImageEnlarged: boolean[] = [];
  enlargeImage(index: number, isEnlarged: boolean): void {
    this.isImageEnlarged[index] = isEnlarged;
  }

  delete!: Subscription;
  deleteProduct(id : any){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.delete = this.productService.deleteProduct(id).subscribe((res)=>{
          this.getProduct()
          this._snackBar.open("Product deleted successfully...","" ,{duration:3000})
        },(error=>{
          this._snackBar.open(error.error.message,"" ,{duration:3000})
        }))
      }
    })
  }

  isEdit = false;
  brandId : any;
  editProduct(id : any){
    this.isEdit = true;
    const dialogRef = this.dialog.open(ProductComponent, {
      data: { status: "true" , type : "edit", id: id},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getSubCategory();
    });
  }

  patchSub!: Subscription;
  patchData(){
    this.patchSub = this.productService.getProduct().subscribe(res=>{
      if(this.dialogData?.type === 'edit'){
        this.editstatus = true
        let product:any = res.find(x =>x.id == this.dialogData?.id)
        this.imageUrl = product.fileUrl

        let productName = product?.productName
        let code = product?.code
        let barCode = product?.barCode
        let categoryId: any = product?.categoryId;
        let subCategoryId: any = product?.subCategoryId;
        let brandId: any = product?.brandId;
        let hsn: any = product?.hsnId;
        let gst: any = product?.gstId;
        let location: any = product?.location;
        let reorderQuantity: any = product?.reorderQuantity;
        let loyaltyPoint: any = product?.loyaltyPoint;

        this.productForm.patchValue({
          productName : productName,
          code : code,
          barCode : barCode,
          categoryId : categoryId,
          subCategoryId : subCategoryId,
          brandId : brandId,
          hsnId : hsn,
          gstId : gst,
          reorderQuantity : reorderQuantity,
          loyaltyPoint : loyaltyPoint,
          locationId : location,
        })
        this.productId = this.dialogData?.id;
      }
    })
  }

  edit!:Subscription;
  editFunction(){
    if(!this.productForm.valid){
      return alert('Please fill the form first')
    }
    if(this.file){
      let image = {
        fileUrl: this.imageUrl,
      }
      this.uploadSubscription = this.productService.updateProductImage(this.file, image).subscribe(res=>{
        this.productForm.patchValue({
          cloudinaryId : res.public_id,
          fileUrl: res.url
        })
        let data={
          productName : this.productForm.get('productName')?.value,
          code : this.productForm.get('code')?.value,
          barCode : this.productForm.get('barCode')?.value,
          categoryId : this.productForm.get('categoryId')?.value,
          subCategoryId : this.productForm.get('subCategoryId')?.value,
          brandId : this.productForm.get('brandId')?.value,
          hsnId : this.productForm.get('hsnId')?.value,
          gstId : this.productForm.get('gstId')?.value,
          reorderQuantity : this.productForm.get('reorderQuantity')?.value,
          loyaltyPoint : this.productForm.get('loyaltyPoint')?.value,
          locationId : this.productForm.get('locationId')?.value,
          cloudinaryId : this.productForm.get('cloudinaryId')?.value,
          fileUrl : this.productForm.get('fileUrl')?.value
        }
        this.submit = this.productService.updateProduct(this.productId, data).subscribe((res)=>{
          console.log(res)
          this.getProduct()
          this._snackBar.open("Product updated successfully...","" ,{duration:3000})
          this.dialogRef.close();
        },(error=>{
              alert(error.message)
            }))
      })
    }else{
      let data={
        productName : this.productForm.get('productName')?.value,
          code : this.productForm.get('code')?.value,
          barCode : this.productForm.get('barCode')?.value,
          categoryId : this.productForm.get('categoryId')?.value,
          subCategoryId : this.productForm.get('subCategoryId')?.value,
          brandId : this.productForm.get('brandId')?.value,
          hsnId : this.productForm.get('hsnId')?.value,
          gstId : this.productForm.get('gstId')?.value,
          reorderQuantity : this.productForm.get('reorderQuantity')?.value,
          loyaltyPoint : this.productForm.get('loyaltyPoint')?.value,
          locationId : this.productForm.get('locationId')?.value
      }
      this.submit = this.productService.updateProduct(this.productId, data).subscribe((res)=>{
        this.getProduct()
        this._snackBar.open("Product updated successfully...","" ,{duration:3000})
        this.dialogRef.close();
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

  clearFileInput() {
    this.imageUrl = '';
  }

  imageSub!: Subscription;
  deleteImage(image: any){
    let data = {
      fileUrl: image
    }
    console.log(data)
    this.imageSub = this.productService.getProductByFileUrl(data).subscribe((res)=>{
    })
  }

  onToggleChange(event: any, id: number) {
    const newValue = event.checked;

    let data = {
      status : newValue
    }
    this.productService.updateProductStatus(id, data).subscribe(data=>{
      console.log(data);
    });
  }
}
