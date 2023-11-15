// import { AdminService } from './../../../admin/admin.service';
import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { Token } from '../../models/token';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private fb:FormBuilder, private router:Router, private authService: AuthService,
    // private adminService: AdminService
    ) { }

  loginForm = this.fb.group({
    phoneNumber: [''],
    password: [''],
  })

  token : any
  submit(){
    this.authService.login(this.loginForm.getRawValue()).subscribe((res)=>{
      this.token = res
      // localStorage.setItem('token', this.token.token)
      if(this.token){
        this.setCurrentUser()
      }
    })
    //alert("Email or password is in correct")
  }

  setCurrentUser(){
    if(localStorage.getItem('token')){
      const token: any = localStorage.getItem('token')
      let user = JSON.parse(token)
      console.log(user)
      // this._http.setCurrentUser(user)
      let roleid = user.role
      // this.adminService.getRoleById(roleid).subscribe((res)=>{
      //   let role = res.roleName.toLowerCase();
        this.router.navigate(['admin']);
      // })

    }
  }

  ngOnInit(): void {
  }


}
