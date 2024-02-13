import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SalesService } from '../../../sales.service';

@Component({
  selector: 'app-view-pick-list-details',
  templateUrl: './view-pick-list-details.component.html',
  styleUrls: ['./view-pick-list-details.component.scss']
})
export class ViewPickListDetailsComponent implements OnInit {

  constructor(private route: ActivatedRoute, private salesService: SalesService) { }

  id!: number;
  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.getPickList();
  }

  getPickList(){
    this.salesService.getPickListById(this.id).subscribe(data=>{
      console.log(data);
    })
  }

  editPickList(id: number){

  }

  deletePickList(id: number){}

}
