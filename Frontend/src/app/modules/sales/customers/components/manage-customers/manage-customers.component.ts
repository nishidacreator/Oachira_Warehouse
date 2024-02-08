import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Route, Router } from '@angular/router';
import { ManageComponent } from 'src/app/modules/products/components/manage/manage.component';

@Component({
  selector: 'app-manage-customers',
  templateUrl: './manage-customers.component.html',
  styleUrls: ['./manage-customers.component.scss']
})
export class ManageCustomersComponent implements OnInit {

  constructor(private fb: FormBuilder, private router: Router, @Optional() public dialogRef: MatDialogRef<ManageComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any){}

  ngOnDestroy(): void {

  }


  ngOnInit(): void {
  }

  onSubmit(){}

  home(){
    this.router.navigateByUrl('/login/settings')
  }
}
