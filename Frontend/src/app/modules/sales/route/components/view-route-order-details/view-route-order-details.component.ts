import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { SalesService } from '../../../sales.service';
import { RouteOrder } from '../../models/route-order';

@Component({
  selector: 'app-view-route-order-details',
  templateUrl: './view-route-order-details.component.html',
  styleUrls: ['./view-route-order-details.component.scss']
})
export class ViewRouteOrderDetailsComponent implements OnInit {

  constructor(private route: ActivatedRoute, private salesService: SalesService) { }

  ngOnDestroy(): void {
    this.plSub?.unsubscribe();
  }

  id!: number;
  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.getRouteOrder();
  }

  routeOrder!: RouteOrder
  plSub!: Subscription;
  getRouteOrder(){
    this.plSub = this.salesService.getRouteOrderById(this.id).subscribe(data=>{
      this.routeOrder = data;
      console.log(data);
    })
  }

  editRouteOrder(id: number){

  }

  deleteRouteOrder(id: number){}

}

