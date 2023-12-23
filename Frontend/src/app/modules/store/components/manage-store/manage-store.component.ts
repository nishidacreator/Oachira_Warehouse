import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-store',
  templateUrl: './manage-store.component.html',
  styleUrls: ['./manage-store.component.scss']
})
export class ManageStoreComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  home(){
    this.router.navigateByUrl('/login/settings')
  }
}
