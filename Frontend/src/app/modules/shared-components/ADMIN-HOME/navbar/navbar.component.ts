import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
// import { AuthService } from 'src/app/modules/auth/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
// import { MasterSearchComponent } from '../../master-search/master-search.component';



@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver, private router:Router,public dialog: MatDialog) {}
username: any
  ngOnInit() {
    const token: any = localStorage.getItem('token');
    let user = JSON.parse(token)
    // this._http.setCurrentUser(user)
    // let roleid = user.role

    // const nestedObject = user.role;
    // this.username = user.userToken.name;
    // console.log(id);

    // console.log('hiiiiiiiiiii'+id)
  }
  logout(){
    // this.authService.logoutUser()
    // this.router.navigateByUrl('')
  }

  // openFullScreenDialog(search: string) {
  //   let searchValue = search.toUpperCase()
  //   const dialogRef = this.dialog.open(MasterSearchComponent, {
  //     maxWidth: '100vw',
  //     maxHeight: '100vh',
  //     width: '100%',
  //     height: '100%',
  //     data: { searchValue } // Pass the searchValue to the dialog component
  //   });
  // console.log(dialogRef)
  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log(`Dialog result: ${result}`);
  //   });
  // }


}
