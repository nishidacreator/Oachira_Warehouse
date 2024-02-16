import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DeleteDialogueComponent } from 'src/app/modules/shared-components/delete-dialogue/delete-dialogue.component';
import { Role } from '../../models/role';
import { User } from '../../models/user';
import { RoleComponent } from '../role/role.component';
import { ProductService } from 'src/app/modules/products/product.service';
import { UsersService } from '../../users.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  branchId!: number;
  constructor(private fb: FormBuilder,public dialog: MatDialog, private userService: UsersService,
    private _snackBar: MatSnackBar, private router: Router,
    @Optional() public dialogRef: MatDialogRef<UsersComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any
    ){
      const token: any = localStorage.getItem('token')
      let user = JSON.parse(token)
      console.log(user)

      this.branchId = user.branch
    }

  userForm = this.fb.group({
    name: ['', Validators.required],
    phoneNumber: ['',[Validators.required, Validators.pattern("^[0-9 +]*$"),Validators.minLength(10),Validators.maxLength(14)]],
    password:[''],
    roleId: [0, Validators.required],
    status: [false],
    branchId: [0]
  });

  updatePasswordValidators(){
    const passwordControl = this.userForm.get('password');
    console.log(passwordControl)
    // Clear existing validators
    passwordControl?.clearValidators();


    // Add validators based on editStatus
    // if (!this.editstatus)  {
      // Add validators for non-edit mode
      passwordControl?.setValidators(Validators.required);
    // }

    // Update the validity of the control
    // passwordControl?.updateValueAndValidity();
  }

  ngOnDestroy(): void {
    this.userSubscriptions?.unsubscribe()
    this.roleSubscription?.unsubscribe()
  }

  addStatus!: string
  editstatus!: boolean;
  type!: string
  ngOnInit() {
    this.userForm.get('status')?.setValue(true);

    this.getRole()
    this.getUsers()
    this.getPaginated()

    if (this.dialogRef) {
      this.addStatus = this.dialogData?.status;
      console.log(this.dialogData);
      this.userService.getRole().subscribe(role => {
        let r = role.find(role => role.roleName === this.dialogData.role);
        console.log(r);
        let id: any = r?.id;
        this.userForm.get('roleId')?.setValue(id)
      })
      // this.userService.getRoleByRole(this.dialogData).subscribe(role => {
      //   console.log(role);
      // })
    }

  }

  roles: Role[] = [];
  roleSubscription?: Subscription;
  getRole(){
    this.roleSubscription = this.userService.getRole().subscribe(role => {
      this.roles = role
    })
  }

  submit!: Subscription;
  onSubmit(){
    if(!this.userForm.valid){
      return alert('Please fill the form first')
    }
    this.submit = this.userService.registerUser(this.userForm.getRawValue()).subscribe((res)=>{
      this._snackBar.open("User added successfully...","" ,{duration:3000});
      let data = {
        user: res
      }
      this.dialogRef?.close(data);
      this.getUsers();
      this.clearControls()
    },(error=>{
      alert(error)
    }))
  }

  clearControls(){
    this.getUsers()
    this.userForm.reset()
    this.userForm.setErrors(null)
    Object.keys(this.userForm.controls).forEach(key=>{this.userForm.get(key)?.setErrors(null)})
  }

  displayedColumns : string[] = ['id','name','phoneNumber', 'roleId','status','manage']

  users : User[]=[];
  userSubscriptions! : Subscription;
  getUsers(){
    this.userSubscriptions = this.userService.getUser().subscribe((res)=>{
      this.users = res
      if(this.dialogData?.type === 'edit'){
        this.patchData();
      }
    })
  }

  scSubscription? : Subscription
  dataSource! : MatTableDataSource<any>
  getPaginated(){
    this.scSubscription = this.userService.getPaginatedUser(this.filterValue, this.currentPage, this.pageSize).subscribe((res:any)=>{
      this.filtered = res.items;
      this.totalItems = res.count;
    })
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getPaginated();
  }

  pageSize = 10;
  currentPage = 1;
  totalItems = 0;
  filterValue = "";
  onInputChange(value: any) {
    this.filterValue = value;
    if (!this.filterValue) {
      this.getPaginated();
    }
  }

  filtered!: any[];
  applyFilter(event: Event): void {
    if((event.target as HTMLInputElement).value.trim() === '') {
      this.getPaginated();
    }else{
      const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
      this.filtered = this.users.filter(element =>
        element.name.toLowerCase().includes(filterValue)
        || element.id.toString().includes(filterValue)
    );
    }
  }

  delete!: Subscription;
  deleteUser(id: number){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.delete = this.userService.deleteUser(id).subscribe((res)=>{
          this.getPaginated()
          this._snackBar.open("User deleted successfully...","" ,{duration:3000})
        },(error=>{
          this._snackBar.open(error.error.message,"" ,{duration:3000})
        }))
      }
    })
  }

  isEdit = false;
  userId : any;
  editUser(id : any){
    this.isEdit = true;
    const dialogRef = this.dialog.open(UsersComponent, {
      data: { status: "true" , type : "edit", id: id},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getPaginated();
    });
  }

  patchData(){
    //Get the product based on the ID
    if(this.dialogData?.type === 'edit'){
      this.editstatus = true
      this.updatePasswordValidators();
      let user: any= this.users.find(x =>x.id == this.dialogData.id)

      //Populate the object by the ID
      let name = user.name.toString();
      let phoneNumber = user.phoneNumber.toString();
      let roleId = user.roleId;
      let status = user.status

      this.userForm.patchValue({
        name : name,
        phoneNumber : phoneNumber,
        roleId : roleId,
        status : status
      })
      this.userId = this.dialogData.id;
    }

  }

  edit!: Subscription;
  editFunction(){
    if(!this.userForm.valid){
      return alert('Please fill the form first')
    }
    this.isEdit = false;

    let data: any ={
      name : this.userForm.get('name')?.value,
      phoneNumber : this.userForm.get('phoneNumber')?.value,
      roleId : this.userForm.get('roleId')?.value,
      status : this.userForm.get('status')?.value
    }

    this.edit = this.userService.updateUser(this.userId, data).subscribe((res)=>{
      this.dialogRef?.close();
      this._snackBar.open("User updated successfully...","" ,{duration:3000})
      this.getUsers();
      this.clearControls();
    },(error=>{
          alert(error.message)
        }))
  }

  addRole(){
    const dialogRef = this.dialog.open(RoleComponent, {
      data: {status : 'true'}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getRole()
    })
  }

  // addBranch(){
  //   const dialogRef = this.dialog.open(BranchManagementComponent, {
  //     data: {status : 'true'}
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     this.getBranch()
  //   })
  // }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onToggleChange(event: any, id: number) {
    const newValue = event.checked;

    let data = {
      status : newValue
    }
    this.userService.updateUserStatus(id, data).subscribe(data=>{
      console.log(data);
    });
  }
}
