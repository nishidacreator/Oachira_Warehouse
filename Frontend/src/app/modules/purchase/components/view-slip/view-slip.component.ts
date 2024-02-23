import { Component, OnDestroy, OnInit } from '@angular/core';
import { PurchaseService } from '../../purchase.service';
import { Subscription } from 'rxjs';
import { Slip } from '../../models/slip';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-slip',
  templateUrl: './view-slip.component.html',
  styleUrls: ['./view-slip.component.scss']
})
export class ViewSlipComponent implements OnInit, OnDestroy {

  constructor(private purchaseService: PurchaseService, private router: Router) { }
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

}
