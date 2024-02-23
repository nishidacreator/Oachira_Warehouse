import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { PurchaseService } from '../../purchase.service';
import { PurchaseRequest } from '../../models/purchase-request';
import { MatDialog } from '@angular/material/dialog';
import { RequestComponent } from '../request/request.component';
import { DeleteDialogueComponent } from 'src/app/modules/shared-components/delete-dialogue/delete-dialogue.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-view-request',
  templateUrl: './view-request.component.html',
  styleUrls: ['./view-request.component.scss']
})
export class ViewRequestComponent implements OnInit {

  constructor( private _snackBar: MatSnackBar, private purchaseService: PurchaseService, private router: Router, private dialog: MatDialog) { }

  ngOnDestroy(): void {
    this.prSub?.unsubscribe();
    this.deleteSub?.unsubscribe();
  }

  ngOnInit(): void {
    this.getPR()
  }

  pr: PurchaseRequest[] = [];
  prSub!: Subscription;
  getPR(){
    this.prSub = this.purchaseService.getPR().subscribe(pr =>{
      console.log(pr);
      this.pr = pr.filter(pr => pr.status.toLowerCase() === 'raised');
    })
  }

  addPR(){
    this.router.navigateByUrl('/login/purachases/purchaserequest')
  }

  viewPurchaseRequest(id: number){
    this.router.navigateByUrl('/login/purachases/purchaserequest/view/'+id)
  }

  addOrder(id: number){
    this.router.navigateByUrl('/login/purachases/Order/'+id)
  }

  editRequest(id: number){
    this.router.navigateByUrl('/login/purachases/purchaserequest/'+id)
  }

  deleteSub!: Subscription;
  deleteRequest(id: number){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result==true){
        this.deleteSub = this.purchaseService.deletePR(id).subscribe(result => {
          this._snackBar.open("Purchase request successfully...","" ,{duration:3000})
          this.getPR();

        })
      }

    })
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

  addPO(){
    this.router.navigateByUrl('/login/purachases/Order')
  }
}
