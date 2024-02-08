import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-trip',
  templateUrl: './manage-trip.component.html',
  styleUrls: ['./manage-trip.component.scss']
})
export class ManageTripComponent implements OnInit {

  constructor(private fb: FormBuilder, private router: Router){}

  ngOnInit(): void {}

  home(){
    this.router.navigateByUrl('/login/settings')
  }

}
