import { Component, OnDestroy, OnInit } from '@angular/core';
import { PurchaseService } from '../../purchase.service';
import { Subscription } from 'rxjs';
import { PurchaseOrder } from '../../models/purchase-order';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.component.html',
  styleUrls: ['./view-order.component.scss']
})
export class ViewOrderComponent implements OnInit, OnDestroy {

  constructor(private purchaseService: PurchaseService, private router: Router) { }

  ngOnDestroy(): void {
    this.poSub?.unsubscribe();
  }

  ngOnInit(): void {
    this.getPO()
  }

  po: PurchaseOrder[] = [];
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

}
