import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { BrokerAccount } from '../../models/broker-account';
import { PurchaseService } from '../../purchase.service';
import { PurchaseLoading } from '../../models/purchase-loading';

@Component({
  selector: 'app-print-unloading-slip',
  templateUrl: './print-unloading-slip.component.html',
  styleUrls: ['./print-unloading-slip.component.scss']
})
export class PrintUnloadingSlipComponent implements OnInit {

  constructor(public purchaseService: PurchaseService, public dialog: MatDialog, private route: ActivatedRoute){}

  ngOnDestroy() {
    this.slipSub?.unsubscribe();
  }


  ngOnInit(): void {
    this.getSlipById()
  }

  slips!: PurchaseLoading;
  slipSub!: Subscription;
  getSlipById(){
    this.slipSub = this.purchaseService.getPurchaseUnloadingById(this.route.snapshot.params['id']).subscribe(slip => {
      this.slips = slip
      console.log(this.slips);
    })
  }

  printDiv() {
    var divContents = document.getElementById("return-slip")?.innerHTML;
    const contentHeight = this.calculateContentHeight(); // Add a function to calculate content height
    console.log(contentHeight);
    var a = window.open('', '', ' width=500px');
    if(divContents){
      a?.document.write('<html>');
      a?.document.write('<body style="display:flex; size: auto">');
      a?.document.write(divContents);
      a?.document.write('</body></html>');
      a?.document.close();
      a?.print();
    }
  }


  calculateContentHeight() {
    // Add logic to calculate the content height dynamically
    // You may use document.body.scrollHeight or any other suitable method
    // Adjust this logic based on your specific requirements
    return document.body.scrollHeight;
  }
}

