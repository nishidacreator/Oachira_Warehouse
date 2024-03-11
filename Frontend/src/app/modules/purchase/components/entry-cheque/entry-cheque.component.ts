import { Component, OnInit } from '@angular/core';
import { EntryCheque } from '../../models/entry-cheque';
import { PurchaseService } from '../../purchase.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-entry-cheque',
  templateUrl: './entry-cheque.component.html',
  styleUrls: ['./entry-cheque.component.scss']
})
export class EntryChequeComponent implements OnInit {

  constructor(private purchaseService: PurchaseService, private router: Router, private dialog: MatDialog) { }
  ngOnDestroy(): void {
    this.chequeSub?.unsubscribe();
  }

  ngOnInit(): void {
    this.getCheque()
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

  chequeSub!: Subscription;
  cheque: EntryCheque[] = [];
  getCheque(){
    this.chequeSub = this.purchaseService.getEntryCheque().subscribe(data=>{
      this.cheque = data
      console.log(this.cheque);
    });
  }

  printSlip(id: number){
    this.router.navigateByUrl('/login/purachases/printslip/'+id);
  }

  // editSlip(id: number){
  //   const dialogRef = this.dialog.open(EntryComponent, {
  //     data: { status: "true" , type : "slipedit", id: id},
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {
  //     this.getSlip();
  //   });
  // }

  // delete!: Subscription;
  // deleteSlip(id: number){
  //   const dialogRef = this.dialog.open(DeleteDialogueComponent, {
  //     data: {}
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result === true) {
  //       this.delete = this.purchaseService.deleteSlip(id).subscribe((res)=>{
  //         this.getSlip()
  //         this._snackBar.open("Slip deleted successfully...","" ,{duration:3000})
  //       },(error=>{
  //         this._snackBar.open(error.error.message,"" ,{duration:3000})
  //       }))
  //     }
  //   })
  // }

}

