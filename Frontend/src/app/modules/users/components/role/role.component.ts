import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { DeleteDialogueComponent } from 'src/app/modules/shared-components/delete-dialogue/delete-dialogue.component';
import { Role } from '../../models/role';
import { UsersService } from '../../users.service';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {

  constructor(private fb: FormBuilder,public userService: UsersService, private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    @Optional() public dialogRef: MatDialogRef<RoleComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any
    ){}

  ngOnDestroy() {
    this.roleSubscription?.unsubscribe()
    if(this.submit){
      this.submit.unsubscribe()
    }this.edit
    if(this.submit){
      this.edit.unsubscribe()
    }
    if(this.delete){
      this.delete.unsubscribe()
    }
  }

  roleForm = this.fb.group({
    roleName: ['', Validators.required],
    status: [false]
  });

  displayedColumns : string[] = ['id','roleName','status','manage']

  addStatus!: string
  ngOnInit(): void {
    this.roleSubscription = this.getRoles()

    if (this.dialogRef) {
      this.addStatus = this.dialogData?.status;
    }

  }

  homeClick(){
    // const dialogRef = this.dialog.open(UserManagementComponent, {
    //   height: '200px',
    //   width: '800px',
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log(`Dialog result: ${result}`);
    // })
  }

  submit!: Subscription;
  onSubmit(){
    this.submit = this.userService.addRole(this.roleForm.getRawValue()).subscribe((res)=>{
      this._snackBar.open("Role added successfully...","" ,{duration:3000})
      this.getRoles()
      this.clearControls()
    },(error=>{
      alert(error)
    }))
  }

  clearControls(){
    this.roleForm.reset()
    this.roleForm.setErrors(null)
    Object.keys(this.roleForm.controls).forEach(key=>{this.roleForm.get(key)?.setErrors(null)})
  }

  roles: Role[] = [];
  roleSubscription? : Subscription
  getRoles(){
    return this.userService.getRole().subscribe((res)=>{
      this.roles = res
      this.filtered = this.roles
    })
  }

  filterValue: any;
  filtered!: any[];
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filterValue = filterValue;
    this.filtered = this.roles.filter(element =>
      element.roleName.toLowerCase().includes(filterValue)
      || element.id.toString().includes(filterValue)
      || element.status.toString().includes(filterValue)
    );
  }

  delete!: Subscription;
  deleteRole(id : any){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.delete = this.userService.deleteRole(id).subscribe((res)=>{
          this.getRoles()
          this._snackBar.open("Role deleted successfully...","" ,{duration:3000})
        },(error=>{
          this._snackBar.open(error.error.message,"" ,{duration:3000})
        }))
      }
    })
  }

  isEdit = false;
  roleId : any;
  editRole(id : any){
    this.isEdit = true;
    //Get the product based on the ID
    let role: any= this.roles.find(x =>x.id == id)

    //Populate the object by the ID
    let roleName = role.roleName.toString();
    let status = role.status

    this.roleForm.patchValue({roleName : roleName, status : status})
    this.roleId = id;
  }

  edit!: Subscription;
  editFunction(){
    this.isEdit = false;

    let data: any ={
      roleName : this.roleForm.get('roleName')?.value,
      status : this.roleForm.get('status')?.value
    }

    this.edit = this.userService.updateRole(data, this.roleId).subscribe((res)=>{
      this._snackBar.open("Role updated successfully...","" ,{duration:3000})
      this.getRoles();
      this.clearControls();
    },(error=>{
          alert(error.message)
        }))
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
