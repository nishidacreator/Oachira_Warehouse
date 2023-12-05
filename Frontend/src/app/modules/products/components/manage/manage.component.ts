import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  constructor(private fb: FormBuilder, private router: Router, @Optional() public dialogRef: MatDialogRef<ManageComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any){}

  ngOnDestroy(): void {

  }


  ngOnInit(): void {
    console.log("hiii")
  }

  onSubmit(){}

  onCancelClick(): void {
    this.router.navigateByUrl('admin/settings')
    this.dialogRef.close();
  }

  manageProductCategory(){
    this.router.navigateByUrl('products/settings/category')
    // this.dialogRef.close();
  }

  manageUnits(){
    this.router.navigateByUrl('admin/settings/product/unit')
    this.dialogRef.close();
  }

  manageBrands(){
    this.router.navigateByUrl('admin/settings/product/brand');
    this.dialogRef.close();
  }

  manageProducts(){
    this.router.navigateByUrl('admin/settings/product/addproduct')
    this.dialogRef.close();
  }
}
