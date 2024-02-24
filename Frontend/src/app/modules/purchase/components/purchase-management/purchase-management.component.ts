import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-purchase-management',
  templateUrl: './purchase-management.component.html',
  styleUrls: ['./purchase-management.component.scss']
})
export class PurchaseManagementComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  home(){
    this.router.navigateByUrl('/login/settings')
  }

}
