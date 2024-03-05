import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SalesService } from '../../../sales.service';
import { Trip } from '../../models/trip';
import { DailyCollection } from '../../models/daily-collection';
import { Route } from '../../models/route';

@Component({
  selector: 'app-details-view-dailycollection',
  templateUrl: './details-view-dailycollection.component.html',
  styleUrls: ['./details-view-dailycollection.component.scss']
})
export class DetailsViewDailycollectionComponent implements OnInit {


  constructor(private salesService: SalesService, private route: ActivatedRoute, private router: Router) { }

  ngOnDestroy(): void {
    this.tripSub?.unsubscribe();
  }

  tripId!: number;
  ngOnInit(): void {
    this.tripId = this.route.snapshot.params['id'];
    this.getDailyCollection()
    
  }

  dc!: DailyCollection | undefined;
  tripSub!: Subscription;
  routess:Route[]=[];
  getDailyCollection(){
    this.tripSub = this.salesService.getDailyCollectionById(this.tripId).subscribe(data => {
      this.dc = data



    console.log("VIEW DETAILS INFO",this.dc)
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


}
