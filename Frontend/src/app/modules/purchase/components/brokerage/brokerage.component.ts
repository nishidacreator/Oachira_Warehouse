import { Component, OnDestroy, OnInit } from '@angular/core';
import { PurchaseService } from '../../purchase.service';
import { Subscription } from 'rxjs';
import { BrokerAccount } from '../../models/broker-account';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { EntryComponent } from '../entry/entry.component';
import { DeleteDialogueComponent } from 'src/app/modules/shared-components/delete-dialogue/delete-dialogue.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-brokerage',
  templateUrl: './brokerage.component.html',
  styleUrls: ['./brokerage.component.scss']
})
export class BrokerageComponent implements OnInit, OnDestroy {

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
    // this.brokerSub?.unsubscribe();
  }

  ngOnInit(): void {
    this.getBrokerage();
  }

  brokerSub!: Subscription;
  brokerageOpen: BrokerAccount[] = [];
  brokerageClosed: BrokerAccount[] = [];
  getBrokerage() {
    this.brokerSub = this.purchaseService.getBrokerAccount().subscribe(broker => {
      this.brokerageOpen = broker.filter(account => account.status === 'opened');
      this.brokerageClosed = broker.filter(account => account.status === 'closed');
    });
  }


  onToggleChange( id: number) {
    let data = {
      status : "closed"
    }
    this.purchaseService.updateBrokerAccountStatus(id, data).subscribe(data=>{
      this.getBrokerage()
    });
  }

  printBrokerSlip(id: number){
    this.router.navigateByUrl('/login/purachases/printbrokerslip/'+id);
  }

  editBrokerSlip(id: number){
    const dialogRef = this.dialog.open(EntryComponent, {
      data: { status: "true" , type : "brokerslipedit", id: id},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getBrokerage();
    });
  }

  delete!: Subscription;
  deleteBrokerSlip(id: number){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.delete = this.purchaseService.deleteBrokerAccount(id).subscribe((res)=>{
          this.getBrokerage()
          this._snackBar.open("Brokerage deleted successfully...","" ,{duration:3000})
        },(error=>{
          this._snackBar.open(error.error.message,"" ,{duration:3000})
        }))
      }
    })
  }
}
