import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ManageComponent } from 'src/app/modules/products/components/manage/manage.component';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent implements OnInit {

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
