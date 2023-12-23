import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UsersService } from '../../users/users.service';
import { Role } from '../../users/models/role';
// import { Role } from '../../../auth/models/role';
// import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(private fb:FormBuilder, private router:Router, private userService: UsersService) { }

  registerForm = this.fb.group({
    name: [''],
    phoneNumber: [''],
    password: [''],
    roleId: [''],
    status: [false]
  })

  //color: ThemePalette = 'accent';
  checked = true;
  disabled = false;

  role$! : Observable<Role[]>
  getRole(){
    this.role$ = this.userService.getRole()
  }

  submit(){
    this.userService.registerUser(this.registerForm.getRawValue()).subscribe((res)=>{})
  }

  ngOnInit(): void {
    this.getRole()
  }


}

