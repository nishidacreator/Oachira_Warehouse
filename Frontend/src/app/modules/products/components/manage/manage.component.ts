import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<ManageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private router: Router){}

  ngOnDestroy(): void {

  }


  ngOnInit(): void {}

  onSubmit(){}

  onCancelClick(): void {
    this.router.navigateByUrl('admin/settings')
    this.dialogRef.close();
  }

  manageProductCategory(){
    this.router.navigateByUrl('admin/settings/product/category')
    this.dialogRef.close();
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
