import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';



// import { Register } from 'src/app/modules/auth/models/register';
// import { UserManagementComponent } from '../user-management/user-management.component';
import { Observable } from 'rxjs';
import { CompanyService } from '../../company.service';
import { Team } from '../../models/team';
import { UsersComponent } from 'src/app/modules/users/components/users/users.component';
import { User } from 'src/app/modules/users/models/user';
import { UsersService } from 'src/app/modules/users/users.service';
import { DeleteDialogueComponent } from 'src/app/modules/shared-components/delete-dialogue/delete-dialogue.component';
@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent {
 // displayedColumns: string[] = [ 'teamName', 'action'];
 displayedColumns: string[] = ['teamName','teamMembers', 'action'];

  constructor(public dialog: MatDialog, private _snackbar: MatSnackBar, private companyService: CompanyService, private fb: FormBuilder,
   private userService: UsersService) { }
 teamForm = this.fb.group({
   teamName: ['', Validators.required],
  //  userId: ['', Validators.required],
  //  teamMembers: ['', Validators.required]
  teamMembers: [[]] // Initialize as an empty array
 });


 ngOnInit(): void {
   this.getTeams()
   this.getUsers()
 }
 teams: Team[] = []
 getTeams() {
   this.companyService.getTeams().subscribe((res) => {
     this.teams = res;
     console.log('teams',res);
   })
 }
 onSubmit() {
   let teamMem: any = this.teamForm.getRawValue();
   console.log(teamMem);

   let teamM = [];
   for(let i = 0; i< teamMem.teamMembers.length; i++) {
    teamM[i] = {
        userId : teamMem.teamMembers[i]
      }
    }

    let  data = {
      teamName: teamMem.teamName,
      userId: teamMem.userId,
      teamMembers: teamM
    }

   console.log(data)
   this.companyService.addTeam(data).subscribe((res) => {
     console.log(res)
     this._snackbar.open("Team added successfully...", "", { duration: 3000 })
     this.clearControls()
   }, (error => {
     console.log('err',error)
     alert(error)
   }))
 }

 clearControls() {
   this.teamForm.reset()
   this.teamForm.setErrors(null)
   //Object.keys(this.teamForm.controls).forEach(key=>{this.teamForm.get(key).setErrors(null)})
   this.getTeams()
 }


 onCancelClick(): void {
  //  this.dialogRef.close();
 }
 teamMembers!:any// Initialize as null or another appropriate initial value


 isEdit = false;
 teamId: any | undefined;
 editFunction(id: any) {
  this.isEdit = true;
  this.teamId = id;
  console.log(this.teamId);
  this.companyService.getTeamById(this.teamId).subscribe((res) => {
    let app$ = res;
    console.log(app$);
    console.log(app$.teamMembers)
    let members : any = app$.teamMembers

    let teamName = app$.teamName;
    let lead: any = app$.userId;
    let teamMembers : any = members.map((x:any)=>x.userId)



    this.teamForm.patchValue({
      teamName: teamName,
      // userId: lead,
      teamMembers : teamMembers

    });
  });
}



 edit() {

  let teamMem: any = this.teamForm.getRawValue();
  console.log(teamMem);

  let teamM = [];
  for(let i = 0; i< teamMem.teamMembers.length; i++) {
   teamM[i] = {
       userId : teamMem.teamMembers[i]
     }
   }

   let  data = {
     teamName: teamMem.teamName,
     userId: teamMem.userId,
     teamMembers: teamM
   }

  console.log(data)

   this.isEdit = true
  //  let data = {
  //    teamName: this.teamForm.get('teamName')?.value,


  //  }
  //  console.log(data)
   console.log(this.teamId)
   this.companyService.updateTeam(this.teamId, data).subscribe((res) => {
     this._snackbar.open("Team updated successfully...", "", { duration: 3000 })
     this.clearControls()

     console.log(res)
   })



 }
 deleteFunction(id: number) {
   const dialogRef = this.dialog.open(DeleteDialogueComponent, {
     width: '450px',
     data: {}
   });

   dialogRef.afterClosed().subscribe((result) => {
     if (result === true) {

       this.companyService.deleteTeam(id).subscribe((res) => {
         this._snackbar.open("Team deleted successfully...", "", { duration: 3000 })
         this.getTeams()
       }, (error => {
         console.log(error)
         this._snackbar.open(error.error.message, "", { duration: 3000 })
       }))
     }
   });


 }

 manageUser() {
  const dialogRef = this.dialog.open(UsersComponent, {
    height: "800px",
    width: "1200px",
  });
  dialogRef.afterClosed().subscribe((result) => {

  });
}
 users!: Observable<User[]>;
getUsers() {
  this.users = this.userService.getUser();
}

 clear() {
   this.teamForm.reset()

 }

}
