import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductService } from '../../product.service';
import { ProductDistributor } from '../../models/product-distributor';
import { FormBuilder, FormControl } from '@angular/forms';
import { Product } from '../../models/product';
import { ProductComponent } from '../product/product.component';
import { DeleteDialogueComponent } from 'src/app/modules/shared-components/delete-dialogue/delete-dialogue.component';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-product-distributor',
  templateUrl: './product-distributor.component.html',
  styleUrls: ['./product-distributor.component.scss']
})
export class ProductDistributorComponent implements OnInit {

  constructor(public dialog: MatDialog, @Optional() public dialogRef: MatDialogRef<ProductDistributorComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any, private productService: ProductService,
    private fb: FormBuilder, private _snackBar: MatSnackBar) { }


    addProductForm = this.fb.group({
      products: ['']
    });

  id!: number;
  ngOnInit(): void {
    this.getProductsDistributor();
    this.id = this.dialogData.id;
    this.addStatus = this.dialogData.status;
    if(this.addStatus){
      this.getProducts()
    }
  }

  form = this.fb.group({
    status: ['']
  });

  checked = true;
  products!: ProductDistributor[]
  getProductsDistributor(){
    this.productService.getProductsByDistributor(this.dialogData.id).subscribe(res=>{
      this.products = res
      console.log(this.products);
    })
  }

  onSlideToggleChange(event: any, id: number) {
    if (event instanceof MatSlideToggleChange) {
      const newStatus = event.checked;
      this.updateStatus(newStatus, id);
    }
  }

  // brokerageApplicable(event: any, id: number) {
  //   if (event instanceof MatSlideToggleChange) {
  //     const newStatus = event.checked;
  //     let data = {
  //       brokerage: newStatus
  //     }
  //     this.productService.brokerageApplicable(id, data).subscribe(res=>{
  //       this._snackBar.open("Brokerage updated successfully...","" ,{duration:3000})
  //       this.getProductsDistributor
  //     })
  //   }
  // }

  // advanceApplicable(event: any, id: number) {
  //   if (event instanceof MatSlideToggleChange) {
  //     const newStatus = event.checked;
  //     let data = {
  //       advance: newStatus
  //     }
  //     this.productService.advanceApplicable(id, data).subscribe(res=>{
  //       this._snackBar.open("Advance updated successfully...","" ,{duration:3000})
  //       this.getProductsDistributor
  //     })
  //   }
  // }

  element = {
    status: false, // Initial status value
  };

  updateStatus(newStatus: boolean, id: number) {
    let data = {
      status: newStatus
    }
    this.productService.updateProductDistributorStatus(data, id).subscribe(res=>{
      this.getProductsDistributor()
    })
  }

  addStatus: boolean = false;
  addMoreProducts(){
    const dialogRef = this.dialog.open(ProductDistributorComponent, {
      data: { id: this.dialogData.id, status: true},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getProductsDistributor();
    });
  }

  prods!: Product[]
  getProducts(){
    this.productService.getProduct().subscribe(res=>{
      this.prods = res;
      this.filteredProduct = this.prods
    });
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
    this.filteredProduct = this.prods.filter((option) => {
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
      this.getProductsDistributor();
    });
  }

  onSubmit(){
    if(!this.addProductForm.valid){
      return alert('Please fill the form first')
    }
    let form = this.addProductForm.getRawValue().products;
    let products = []
    if (form !== null) {
      for( let i = 0; i < form?.length; i++ ){
        products[i] = {
          productId : form[i],
          distributorId : this.id
        }
      }

      this.productService.addProductDistributor(products).subscribe((result) => {
        this.dialogRef?.close();
      })
    }
  }

  edit(id: number){

  }

  delete!: Subscription;
  deleteProd(id: number){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.delete = this.productService.deleteProductDistributor(id).subscribe((res)=>{
          this.getProductsDistributor()
          this._snackBar.open("Product deleted successfully...","" ,{duration:3000})
        },(error=>{
          this._snackBar.open(error.error.message,"" ,{duration:3000})
        }))
      }
    })
  }

}
