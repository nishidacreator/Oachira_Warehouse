import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PurchaseService } from '../../purchase.service';
import { Entry } from '../../models/entry';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-entry',
  templateUrl: './view-entry.component.html',
  styleUrls: ['./view-entry.component.scss']
})
export class ViewEntryComponent implements OnInit {

  constructor(private purchaseService: PurchaseService, private router: Router) { }

  ngOnInit(): void {
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
  pe: Entry[] = [];
  getEntry(){
    this.entrySub = this.purchaseService.getPe().subscribe(x=>{
      this.pe = x;
    })
  }

  addPR(){
    this.router.navigateByUrl('/login/purachases/purchaseentry')
  }

}
