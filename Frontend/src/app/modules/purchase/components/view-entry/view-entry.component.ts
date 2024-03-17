import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PurchaseService } from '../../purchase.service';
import { Entry } from '../../models/entry';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { EntryComponent } from '../entry/entry.component';

@Component({
  selector: 'app-view-entry',
  templateUrl: './view-entry.component.html',
  styleUrls: ['./view-entry.component.scss']
})
export class ViewEntryComponent implements OnInit, OnDestroy {

  constructor(private purchaseService: PurchaseService, private router: Router, private dialog: MatDialog) { }

  ngOnDestroy(): void {
    this.delete?.unsubscribe();
    this.entrySub?.unsubscribe();
  }

  ngOnInit(): void {
    this.getEntry();
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

  entrySub!: Subscription;
  pendingPeSlip: Entry[] = [];
  pendingPeCheque: Entry[] = [];
  compPe: Entry[] = [];
  advancedPe: Entry[] = [];
  getEntry(){
    this.entrySub = this.purchaseService.getPe().subscribe(x=>{
      console.log(x);

      this.pendingPeSlip = x.filter(x=>x.status === 'SlipIssued');
      this.pendingPeCheque = x.filter(x=>x.status === 'ChequeIssued');
      this.advancedPe = x.filter(x=>x.status === 'AdvanceIssued');
    })
  }

  addPE(){
    this.router.navigateByUrl('/login/purachases/purchaseentry')
  }

  onToggleChange( id: number) {
    const dialogRef = this.dialog.open(EntryComponent, {
      data: {id: id, status: 'update'}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getEntry()
    })

  }

  editPurchaseEntry(id: number){
    this.router.navigateByUrl('/login/purachases/editpurchaseentry/'+id)
  }

  delete!: Subscription;
  deletePurchaseEntry(id: number){
    this.delete = this.purchaseService.deletePE(id).subscribe(res=>{
      console.log(res);

    })
  }

  addPurchaseEntry(id: number){
    this.router.navigateByUrl('/login/purachases/editpurchaseentry/'+id)
  }

  generateTS(id: number){
    this.purchaseService.getPurchaseTransporterByEntryId(id).subscribe(res=>{
      console.log(res);
      if(res){
        return alert("Transporter Slip is already generated for selected purchase entry");
      }else{
        this.router.navigateByUrl('/login/purachases/addtransporterslip/'+id);
      }

    });
  }

  generateCommision(id: number){
    this.purchaseService.getBrockerAccountByEntryId(id).subscribe(res=>{
      console.log(res);
      if(res){
        return alert("Broker Slip is already generated for selected purchase entry");
      }else{
        this.router.navigateByUrl('/login/purachases/addbrokerslip/'+id);
      }

    });
  }

  generateUS(id: number){
    this.purchaseService.getPurchaseUnloadingByEntryId(id).subscribe(res=>{
      console.log(res);
      if(res){
        return alert("Unloading Slip is already generated for selected purchase entry");
      }else{
        this.router.navigateByUrl('/login/purachases/addunloadingslip/'+id);
      }

    });
  }

}
