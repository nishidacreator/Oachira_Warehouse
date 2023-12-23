import { Component, OnInit } from '@angular/core';
import { PurchaseModule } from '../../purchase.module';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PurchaseOrder } from '../../models/purchase-order';
import { PurchaseService } from '../../purchase.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  id!: number;
  pEntry: PurchaseOrder[] = [];
  pESubscription!: Subscription;

  displayedColumns: string[] = ["id","orderNo","vendorId","requestedPurchaseDate","manage","purchaseEntry"];

  constructor(public purchaseService: PurchaseService, public dialog: MatDialog, private router: Router) {}

  ngOnInit(): void {
    // this.pESubscription = this.getPurchaseOrder();
    //User
    const token: any = localStorage.getItem("token");
    let user = JSON.parse(token);
    this.id = user.id;
  }

  ngOnDestroy(): void {
    this.pESubscription.unsubscribe();
  }

  getPurchaseOrder() {
    // return this.purchaseService.getPurchaseOrder().subscribe((res) => {
    //   this.pEntry = res.filter((x: any) => x.userId === this.id);
    // });
  }

  addPurchaseOrder() {
   this.router.navigateByUrl('admin/purachases/addpurchaseorder')
  }

  viewPurchaseOrderDetails(id : number){
    this.router.navigateByUrl('admin/purchases/purchaseorder/viewpurchaseorder/'+ id)
  }

  addPurchaseEntry(id : number){
    this.router.navigateByUrl('admin/purachases/purchaseentry/'+id)
  }

  viewPurchaseEntry(id : number){
    this.router.navigateByUrl('admin/purachases/purchaseentry/'+id)
  }
}
