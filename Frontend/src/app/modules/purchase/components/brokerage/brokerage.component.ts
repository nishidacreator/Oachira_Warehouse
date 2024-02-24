import { Component, OnInit } from '@angular/core';
import { PurchaseService } from '../../purchase.service';
import { Subscription } from 'rxjs';
import { BrokerAccount } from '../../models/broker-account';

@Component({
  selector: 'app-brokerage',
  templateUrl: './brokerage.component.html',
  styleUrls: ['./brokerage.component.scss']
})
export class BrokerageComponent implements OnInit {

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

  constructor(private purchaseService: PurchaseService) { }

  ngOnInit(): void {
  }

  brokerSub!: Subscription;
  brokerageOpen: BrokerAccount[] = [];
  brokerageClosed: BrokerAccount[] = [];
  getBrokerage(){
    this.purchaseService.getBrokerAccount().subscribe(broker =>{
      this.brokerageOpen = broker.filter(account => account.status === 'opened');
      this.brokerageOpen = broker.filter(account => account.status === 'closed');
    });
  }

  onToggleChange( id: number) {
    let data = {
      status : "closed"
    }
    this.purchaseService.updatePurchaseTransporterStatus(id, data).subscribe(data=>{
      this.getBrokerage()
    });
  }

  printBrokerSlip(id: number){

  }

  editBrokerSlip(id: number){

  }

  deleteBrokerSlip(id: number){}
}
