import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-managae-company',
  templateUrl: './managae-company.component.html',
  styleUrls: ['./managae-company.component.scss']
})
export class ManagaeCompanyComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  home(){
    this.router.navigateByUrl('/login/settings')
  }
}

