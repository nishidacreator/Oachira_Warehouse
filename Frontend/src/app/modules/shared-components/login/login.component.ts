// import { AdminService } from './../../../admin/admin.service';
import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '../../users/users.service';
// import { AuthService } from '../../../auth/auth.service';
// import { Token } from '../../../auth/models/token';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private fb:FormBuilder, private router:Router, private userService: UsersService
    // private adminService: AdminService
    ) { }

  loginForm = this.fb.group({
    userName: [''],
    password: [''],
  })

  token : any
  submit(){
    this.userService.login(this.loginForm.getRawValue()).subscribe((res)=>{
      this.token = res

      // localStorage.setItem('token', this.token.token)
      if(this.token){
        this.setCurrentUser()
      }
      else {
        alert("Email or password is in correct")
      }
    })
  }

  setCurrentUser(){
    if(localStorage.getItem('token')){
      const token: any = localStorage.getItem('token')
      let user = JSON.parse(token)
      // this._http.setCurrentUser(user)
      let roleid = user.role
        this.router.navigate(['/login']);
      // })

    }
  }

  ngOnInit(): void {
  }


}
