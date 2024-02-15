import { Component, OnDestroy, OnInit } from '@angular/core';
import { SalesService } from '../../../sales.service';
import { Subscription } from 'rxjs';
import { RouteDetails } from '../../models/route-details';
import { Route } from '../../models/route';

@Component({
  selector: 'app-route-map',
  templateUrl: './route-map.component.html',
  styleUrls: ['./route-map.component.scss']
})
export class RouteMapComponent implements OnInit, OnDestroy {

  constructor(private salesService: SalesService) { }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.getRoute()
  }

  panelOpenState = false;

  route : Route[] = [];
  routeSubscription! : Subscription;
  getRoute(){
    this.routeSubscription =  this.salesService.getRoute().subscribe((res)=>{
      this.route = res
    })
  }

  details : RouteDetails[] = [];
  sortedItems: any[] = [];
  getCustomers(id : any){
    this.panelOpenState = true
    //Route details
    this.salesService.getRouteDetailsByRouteId(id).subscribe((res)=>{
      this.details = res
      this.sortedItems = this.details.sort((a, b) => a.routeIndex - b.routeIndex);
    })

  }

}
