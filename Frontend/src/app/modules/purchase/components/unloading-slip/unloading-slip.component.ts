import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DeleteDialogueComponent } from 'src/app/modules/shared-components/delete-dialogue/delete-dialogue.component';
import { PurchaseTransporter } from '../../models/purchase-transporter';
import { PurchaseService } from '../../purchase.service';
import { EntryComponent } from '../entry/entry.component';
import { PurchaseLoading } from '../../models/purchase-loading';

@Component({
  selector: 'app-unloading-slip',
  templateUrl: './unloading-slip.component.html',
  styleUrls: ['./unloading-slip.component.scss']
})
export class UnloadingSlipComponent implements OnInit {

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

  constructor(private purchaseService: PurchaseService, private router: Router, private dialog: MatDialog,
    private _snackBar: MatSnackBar) { }

  ngOnDestroy(): void {
    this.unSub?.unsubscribe();
  }

  ngOnInit(): void {
    this.getUnloading();
  }

  unOpen: PurchaseLoading[] = [];
  unClose: PurchaseLoading[] = [];
  unSub!: Subscription;
  getUnloading(){
    this.unSub = this.purchaseService.getPurchaseUnloading().subscribe(x=>{
      console.log(x);

      this.unOpen = x.filter(x=>x.status === 'opened');
      this.unClose = x.filter(x=>x.status === 'closed');
    })
  }

  printTransSlip(id: number){
    this.router.navigateByUrl('/login/purachases/printunloadingslip/'+id);
  }

  editUnloadSlip(id: number){
    const dialogRef = this.dialog.open(EntryComponent, {
      data: { status: "true" , type : "unloadslipedit", id: id},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getUnloading();
    });
  }

  delete!: Subscription;
  deleteUnloadSlip(id: number){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.delete = this.purchaseService.deletePurchaseUnloading(id).subscribe((res)=>{
          this.getUnloading()
          this._snackBar.open("Purchase Unloading deleted successfully...","" ,{duration:3000})
        },(error=>{
          this._snackBar.open(error.error.message,"" ,{duration:3000})
        }))
      }
    })
  }

  onToggleChange( id: number) {
    let data = {
      status : "closed"
    }
    this.purchaseService.updatePurchaseUnloadingStatus(id, data).subscribe(data=>{
      this.getUnloading()
    });
  }

}
