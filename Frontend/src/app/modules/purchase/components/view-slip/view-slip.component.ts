import { Component, OnDestroy, OnInit } from '@angular/core';
import { PurchaseService } from '../../purchase.service';
import { Subscription } from 'rxjs';
import { Slip } from '../../models/slip';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogueComponent } from 'src/app/modules/shared-components/delete-dialogue/delete-dialogue.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SlipComponent } from '../slip/slip.component';
import { EntryComponent } from '../entry/entry.component';

@Component({
  selector: 'app-view-slip',
  templateUrl: './view-slip.component.html',
  styleUrls: ['./view-slip.component.scss']
})
export class ViewSlipComponent implements OnInit, OnDestroy {

  constructor(private purchaseService: PurchaseService, private router: Router, private dialog: MatDialog,
    private _snackBar: MatSnackBar) { }
  ngOnDestroy(): void {
    this.slipSub?.unsubscribe();
  }

  ngOnInit(): void {
    this.getSlip()
  }

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

  slipSub!: Subscription;
  slips: Slip[] = [];
  getSlip(){
    this.slipSub = this.purchaseService.getSlip().subscribe(data=>{
      this.slips = data
    });
  }

  printSlip(id: number){
    this.router.navigateByUrl('/login/purachases/printslip/'+id);
  }

  editSlip(id: number){
    const dialogRef = this.dialog.open(EntryComponent, {
      data: { status: "true" , type : "slipedit", id: id},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getSlip();
    });
  }

  delete!: Subscription;
  deleteSlip(id: number){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.delete = this.purchaseService.deleteSlip(id).subscribe((res)=>{
          this.getSlip()
          this._snackBar.open("Slip deleted successfully...","" ,{duration:3000})
        },(error=>{
          this._snackBar.open(error.error.message,"" ,{duration:3000})
        }))
      }
    })
  }

}
