import { Component, OnDestroy, OnInit } from '@angular/core';
import { PurchaseService } from '../../purchase.service';
import { Subscription } from 'rxjs';
import { Order } from '../../models/order';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeleteDialogueComponent } from 'src/app/modules/shared-components/delete-dialogue/delete-dialogue.component';

@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.component.html',
  styleUrls: ['./view-order.component.scss']
})
export class ViewOrderComponent implements OnInit, OnDestroy {
  constructor( private _snackBar: MatSnackBar, private purchaseService: PurchaseService, private router: Router, private dialog: MatDialog) { }

  ngOnDestroy(): void {
    this.poSub?.unsubscribe();
  }

  ngOnInit(): void {
    this.getPO()
  }

  po: Order[] = [];
  poSub!: Subscription;
  getPO(){
    this.poSub = this.purchaseService.getPO().subscribe(po =>{
      console.log(po);
      this.po = po;
    })
  }

  addPO(){
    this.router.navigateByUrl('/login/purachases/purchaseorder')
  }
editPO(id:number){

}
deletePO(id:number){

}
viewPurchaseOrder(id: number){
  this.router.navigateByUrl('/login/purachases/purchaseOrder/view/'+id)
}

editOrder(id: number){
  this.router.navigateByUrl('/login/purachases/purchaseorder/'+id)
}

deleteSub!: Subscription;
deleteOrder(id: number){
  const dialogRef = this.dialog.open(DeleteDialogueComponent, {
    data: {}
  });

  dialogRef.afterClosed().subscribe(result => {
    if(result==true){
      this.deleteSub = this.purchaseService.deletePO(id).subscribe(result => {
        this._snackBar.open("Purchase order deleted successfully...","" ,{duration:3000})
        this.getPO();

      })
    }

  })
}

}

