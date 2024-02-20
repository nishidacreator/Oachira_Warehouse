import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SalesService } from '../../../sales.service';
import { Subscription } from 'rxjs';
import { RouteEntry } from '../../models/route-entry';

@Component({
  selector: 'app-view-route-entry-details',
  templateUrl: './view-route-entry-details.component.html',
  styleUrls: ['./view-route-entry-details.component.scss']
})
export class ViewRouteEntryDetailsComponent implements OnInit {

  constructor(private route: ActivatedRoute, private salesService: SalesService) { }

  id!: number
  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    this.getRouteEntry()
  }

  entrySub!: Subscription;
  entry!: RouteEntry
  getRouteEntry(){
    this.entrySub = this.salesService.getRouteEntryById(this.id).subscribe(data => {
      this.entry = data;
      console.log(this.entry);

    })
  }

}
