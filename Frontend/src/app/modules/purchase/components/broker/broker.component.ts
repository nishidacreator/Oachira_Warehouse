import { Component, Inject, OnDestroy, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ProductComponent } from 'src/app/modules/products/components/product/product.component';
import { Product } from 'src/app/modules/products/models/product';
import { ProductService } from 'src/app/modules/products/product.service';
import { PurchaseService } from '../../purchase.service';
import { Broker } from '../../models/broker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeleteDialogueComponent } from 'src/app/modules/shared-components/delete-dialogue/delete-dialogue.component';

@Component({
  selector: 'app-broker',
  templateUrl: './broker.component.html',
  styleUrls: ['./broker.component.scss']
})
export class BrokerComponent implements OnInit, OnDestroy {

  constructor(private fb: FormBuilder, private dialog: MatDialog, private productService: ProductService,
    private purchaseService: PurchaseService, private _snackBar: MatSnackBar, @Optional() public dialogRef: MatDialogRef<BrokerComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any) { }

  ngOnDestroy(): void {
    this.productSub?.unsubscribe();
    this.brokerSub?.unsubscribe();
  }

  addStatus!: string
  editstatus: boolean = false;
  ngOnInit(): void {
    this.getProduct();
    this.getBroker();

    if (this.dialogRef) {
      this.addStatus = this.dialogData?.status;

      if(this.dialogData.type === 'edit'){
        this.patchData()
      }
    }
  }

  brokerForm = this.fb.group({
    productId : [0, Validators.required],
    brokerName : ['', Validators.required],
    rate : [0, Validators.required]
  });

  productSub!: Subscription;
  product: Product[] = [];
  getProduct(value?:any){
    this.productService.getProduct().subscribe((products) =>{
      this.product = products
      this.filteredOptions = products
      if(value){
        this.filterOptions(value)
      }
    })
  }

  myControl = new FormControl<string | Product>("");
  filteredOptions: any
  filterOptions(event: Event) {

    let value = (event.target as HTMLInputElement).value;
    this.filteredOptions = this.product.filter((option) => {
      if (
        (option.productName &&
          option.productName.toLowerCase().includes(value?.toLowerCase())) ||
        (option.code &&
          option.code.toLowerCase().includes(value?.toLowerCase())) ||
        (option.barCode &&
          option.barCode.toLowerCase().includes(value?.toLowerCase()))
      ) {
        return true;
      } else {
        return null;
      }
    });
  }

  addNewProduct(){
    const dialogRef = this.dialog.open(ProductComponent, {
      data: { status: "true"},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getProduct()
    });

  }

  submit!: Subscription
  onSubmit(){
    console.log(this.brokerForm.getRawValue());

    this.submit = this.purchaseService.addBroker(this.brokerForm.getRawValue()).subscribe(response=>{
      this._snackBar.open("Broker added successfully...","" ,{duration:3000})
      let data = {
        broker: response
      }
      this.dialogRef?.close(data);
      this.clearControls()
    });
  }

  clearControls(){
    this.brokerForm.reset()
    this.getBroker()
  }

  brokerSub!: Subscription;
  broker: Broker[] = [];
  getBroker(){
    this.brokerSub = this.purchaseService.getBroker().subscribe((res:any)=>{
      this.broker = res;
      this.filtered = this.broker;
    })
  }

  filtered!: any[];
  applyFilter(event: Event): void {
    if((event.target as HTMLInputElement).value.trim() === '') {
      this.getBroker();
    }else{
      const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
      this.filtered = this.broker.filter(element =>
        element.brokerName.toLowerCase().includes(filterValue)
        || element.id.toString().includes(filterValue)
        || element.product.productName.toString().includes(filterValue)
    );
    }
  }

  editFunction(){
    if(!this.brokerForm.valid){
      return alert('Please fill the form first')
    }

    this.submit = this.purchaseService.updateBroker(this.brId, this.brokerForm.getRawValue()).subscribe((res)=>{
      console.log(res)
      this._snackBar.open("Broker updated successfully...","" ,{duration:3000})
      this.dialogRef.close();
      this.clearControls();
    })
  }

  onCancelClick(){
    this.dialogRef.close();
  }

  editBroker(id: number){
    const dialogRef = this.dialog.open(BrokerComponent, {
      data: { status: "true" , type : "edit", id: id},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getBroker();
    });
  }

  brId!: number;
  patchData(){
    this.editstatus = true;
    this.purchaseService.getBrokerById(this.dialogData?.id).subscribe(res=>{
      let brokerName = res.brokerName;
      let product: any = res.productId;
      let rate = res.rate

      this.brokerForm.patchValue({
        brokerName : brokerName,
        productId : product,
        rate : rate,
      })
      this.brId = this.dialogData?.id;
    })
  }

  delete!: Subscription;
  deleteBroker(id: number){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.delete = this.purchaseService.deleteBroker(id).subscribe((res)=>{
          this.getBroker()
          this._snackBar.open("Broker deleted successfully...","" ,{duration:3000})
        },(error=>{
          this._snackBar.open(error.error.message,"" ,{duration:3000})
        }))
      }
    })
  }

}
