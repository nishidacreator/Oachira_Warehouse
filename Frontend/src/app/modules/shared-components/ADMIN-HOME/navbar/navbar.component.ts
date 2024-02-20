import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { UsersService } from '../../../users/users.service';
import { Router } from '@angular/router';
// import { AdminService } from '../../../products/';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  isExpanded : boolean = false;

  userName: any
  branchName!: string;
  constructor(private breakpointObserver: BreakpointObserver, private router: Router, private userService: UsersService) {
    const token: any = localStorage.getItem('token')
    let user = JSON.parse(token)
    this.userName = user.name
    // let branchId = user.branch

    // adminService.getBranchById(branchId).subscribe(data => {
    //   console.log(data)
    //   this.branchName = data.branchName
    //   console.log(data)
    // })

  }

  logout(){
    this.userService.logout()
    this.router.navigate([''])
  }

  OpenMasterSearchPage(id: any){}

  isHovered = false;
  hoveredButton: string | null = null;
  showName(buttonName: string, i?: number){
    this.isHovered = true;
    this.hoveredButton = buttonName;
  }

  hideName() {
    this.isHovered = false;
    this.hoveredButton = null;
  }

}
