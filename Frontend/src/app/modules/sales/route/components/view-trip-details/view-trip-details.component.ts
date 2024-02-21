import { Component, OnDestroy, OnInit } from '@angular/core';
import { SalesService } from '../../../sales.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Trip } from '../../models/trip';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-view-trip-details',
  templateUrl: './view-trip-details.component.html',
  styleUrls: ['./view-trip-details.component.scss']
})
export class ViewTripDetailsComponent implements OnInit, OnDestroy {

  constructor(private salesService: SalesService, private route: ActivatedRoute, private router: Router) { }

  ngOnDestroy(): void {
    this.tripSub?.unsubscribe();
  }

  tripId!: number;
  ngOnInit(): void {
    this.tripId = this.route.snapshot.params['id'];
    this.getTrip()
  }

  trip!: Trip;
  tripSub!: Subscription;
  getTrip(){
    this.tripSub = this.salesService.getTripById(this.tripId).subscribe(data => {
      this.trip = data
    });
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

  viewTrip(){
    let routeId = this.trip.routeId
    this.router.navigateByUrl('login/sales/routesale/viewtrip/details/picklist/' + this.tripId + '/' + routeId)
  }
}
