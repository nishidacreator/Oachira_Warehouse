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
  }

  onSubmit(){}

  home(){
    this.router.navigateByUrl('/login/settings')
  }
}
