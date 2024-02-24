import { Component, OnDestroy, OnInit } from '@angular/core';
import { PurchaseTransporter } from '../../models/purchase-transporter';
import { Subscription } from 'rxjs';
import { PurchaseService } from '../../purchase.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogueComponent } from 'src/app/modules/shared-components/delete-dialogue/delete-dialogue.component';
import { EntryComponent } from '../entry/entry.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-purchase-transporter',
  templateUrl: './purchase-transporter.component.html',
  styleUrls: ['./purchase-transporter.component.scss']
})
export class PurchaseTransporterComponent implements OnInit, OnDestroy {

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
    this.transSub?.unsubscribe();
  }

  ngOnInit(): void {
    this.getTransporter();
  }

  transOpen: PurchaseTransporter[] = [];
  transClose: PurchaseTransporter[] = [];
  transSub!: Subscription;
  getTransporter(){
    this.transSub = this.purchaseService.getPurchaseTransporter().subscribe(x=>{
      this.transOpen = x.filter(x=>x.status === 'generated');
      this.transClose = x.filter(x=>x.status === 'closed');
    })
  }

  printTransSlip(id: number){
    this.router.navigateByUrl('/login/purachases/printtransportslip/'+id);
  }

  editTransSlip(id: number){
    const dialogRef = this.dialog.open(EntryComponent, {
      data: { status: "true" , type : "transslipedit", id: id},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getTransporter();
    });
  }

  delete!: Subscription;
  deleteTransSlip(id: number){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.delete = this.purchaseService.deletePurchaseTransporter(id).subscribe((res)=>{
          this.getTransporter()
          this._snackBar.open("Purchase Transporter deleted successfully...","" ,{duration:3000})
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
    this.purchaseService.updatePurchaseTransporterStatus(id, data).subscribe(data=>{
      this.getTransporter()
    });
  }

}
