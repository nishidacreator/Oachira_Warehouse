import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SalesService } from '../../../sales.service';
import { PickList } from '../../models/pick-list';
import { Subscription } from 'rxjs';
import { PickListDetails } from '../../models/pick-list-details';
import { RouteOrderDetails } from '../../models/route-order-details';

@Component({
  selector: 'app-view-pick-list-details',
  templateUrl: './view-pick-list-details.component.html',
  styleUrls: ['./view-pick-list-details.component.scss']
})
export class ViewPickListDetailsComponent implements OnInit, OnDestroy {

  constructor(private route: ActivatedRoute, private salesService: SalesService) { }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.getPickList()
  }

  pickListDetails : RouteOrderDetails[] = []
  detailsSubscription! : Subscription
  getPickList(){
    const routeId = this.route.snapshot.params['routeid']
    return this.salesService.getRouteSoDetailsByProductId(this.route.snapshot.params['id'], routeId)
    .subscribe((res)=>{
      console.log(res);
    })
  }


}
