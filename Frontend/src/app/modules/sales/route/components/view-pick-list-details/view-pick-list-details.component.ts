import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SalesService } from '../../../sales.service';
import { PickList } from '../../models/pick-list';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-view-pick-list-details',
  templateUrl: './view-pick-list-details.component.html',
  styleUrls: ['./view-pick-list-details.component.scss']
})
export class ViewPickListDetailsComponent implements OnInit, OnDestroy {

  constructor(private route: ActivatedRoute, private salesService: SalesService) { }

  ngOnDestroy(): void {
    this.plSub?.unsubscribe();
  }

  id!: number;
  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.getPickList();
  }

  pickList!: PickList
  plSub!: Subscription;
  getPickList(){
    this.plSub = this.salesService.getPickListById(this.id).subscribe(data=>{
      this.pickList = data;
      console.log(data);
    })
  }

  editPickList(id: number){

  }

  deletePickList(id: number){}

}
