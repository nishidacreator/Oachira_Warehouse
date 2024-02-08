import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-route',
  templateUrl: './manage-route.component.html',
  styleUrls: ['./manage-route.component.scss']
})
export class ManageRouteComponent implements OnInit {

  constructor(private fb: FormBuilder, private router: Router){}

  ngOnInit(): void {}

  home(){
    this.router.navigateByUrl('/login/settings')
  }

}
