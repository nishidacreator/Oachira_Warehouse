import { Component, OnInit } from '@angular/core';
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
export class ViewEntryComponent implements OnInit {

  constructor(private purchaseService: PurchaseService, private router: Router, private dialog: MatDialog) { }

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
      this.pendingPeSlip = x.filter(x=>x.status === 'SlipIssued' && x.entryStatus === "pending");
      this.pendingPeCheque = x.filter(x=>x.status === 'ChequeIssued' && x.entryStatus === "pending");
      this.advancedPe = x.filter(x=>x.status === 'AdvanceIssued');
      this.compPe = x.filter(x=>x.entryStatus === 'completed');
      console.log(x);
    })
  }

  addPE(){
    this.router.navigateByUrl('/login/purachases/purchaseentry')
  }

  viewPE(id: number){

  }

  onToggleChange( id: number) {
    const dialogRef = this.dialog.open(EntryComponent, {
      data: {id: id, status: 'update'}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getEntry()
    })

  }

}
