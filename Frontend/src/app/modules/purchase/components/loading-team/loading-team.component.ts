import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { ProductService } from 'src/app/modules/products/product.service';
import { DeleteDialogueComponent } from 'src/app/modules/shared-components/delete-dialogue/delete-dialogue.component';
import { PurchaseService } from '../../purchase.service';
import { LoadingTeam } from '../../models/loading-team';

@Component({
  selector: 'app-loading-team',
  templateUrl: './loading-team.component.html',
  styleUrls: ['./loading-team.component.scss']
})
export class LoadingTeamComponent implements OnInit {

  constructor(private fb: FormBuilder, private dialog: MatDialog, private purchaseService: PurchaseService,
    private _snackBar: MatSnackBar, @Optional() public dialogRef: MatDialogRef<LoadingTeamComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any) { }

  ngOnDestroy(): void {
    this.loadingteamSub?.unsubscribe();
  }

  addStatus!: string
  editstatus: boolean = false;
  ngOnInit(): void {
    this.getLoadingTeam();

    if (this.dialogRef) {
      this.addStatus = this.dialogData?.status;

      if(this.dialogData.type === 'edit'){
        this.patchData()
      }
    }
  }

  loadingForm = this.fb.group({
    teamname : ['', Validators.required]
  });

  submit!: Subscription
  onSubmit(){
    console.log(this.loadingForm.getRawValue());

    this.submit = this.purchaseService.addUnloadingTeam(this.loadingForm.getRawValue()).subscribe(response=>{
      this._snackBar.open("LoadingTeam added successfully...","" ,{duration:3000})
      let data = {
        loadingteam: response
      }
      this.dialogRef?.close(data);
      this.clearControls()
    });
  }

  clearControls(){
    this.loadingForm.reset()
    this.getLoadingTeam()
  }

  loadingteamSub!: Subscription;
  loadingteam: LoadingTeam[] = [];
  getLoadingTeam(){
    this.loadingteamSub = this.purchaseService.getUnloadingTeam().subscribe((res:any)=>{
      this.loadingteam = res;
      this.filtered = this.loadingteam;
    })
  }

  filtered!: any[];
  applyFilter(event: Event): void {
    if((event.target as HTMLInputElement).value.trim() === '') {
      this.getLoadingTeam();
    }else{
      const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
      this.filtered = this.loadingteam.filter(element =>
        element.teamname.toLowerCase().includes(filterValue)
        || element.id.toString().includes(filterValue)
    );
    }
  }

  editFunction(){
    if(!this.loadingForm.valid){
      return alert('Please fill the form first')
    }

    this.submit = this.purchaseService.updateUnloadingTeam(this.brId, this.loadingForm.getRawValue()).subscribe((res)=>{
      console.log(res)
      this._snackBar.open("LoadingTeam updated successfully...","" ,{duration:3000})
      this.dialogRef.close();
      this.clearControls();
    })
  }

  onCancelClick(){
    this.dialogRef.close();
  }

  editLoadingTeam(id: number){
    const dialogRef = this.dialog.open(LoadingTeamComponent, {
      data: { status: "true" , type : "edit", id: id},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getLoadingTeam();
    });
  }

  brId!: number;
  patchData(){
    this.editstatus = true;
    this.purchaseService.getUnloadingTeamById(this.dialogData?.id).subscribe(res=>{
      console.log(res);

      let teamname = res.teamname;

      this.loadingForm.patchValue({
        teamname : teamname
      })
      this.brId = this.dialogData?.id;
    })
  }

  delete!: Subscription;
  deleteLoadingTeam(id: number){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.delete = this.purchaseService.deleteUnloadingTeam(id).subscribe((res)=>{
          this.getLoadingTeam()
          this._snackBar.open("LoadingTeam deleted successfully...","" ,{duration:3000})
        },(error=>{
          this._snackBar.open(error.error.message,"" ,{duration:3000})
        }))
      }
    })
  }

}
