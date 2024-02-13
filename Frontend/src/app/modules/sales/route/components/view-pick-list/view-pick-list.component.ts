import { Component, OnDestroy, OnInit } from '@angular/core';
import { SalesService } from '../../../sales.service';
import { Subscription } from 'rxjs';
import { PickList } from '../../models/pick-list';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-pick-list',
  templateUrl: './view-pick-list.component.html',
  styleUrls: ['./view-pick-list.component.scss']
})
export class ViewPickListComponent implements OnInit, OnDestroy {

  constructor(private salesService: SalesService, private router: Router) { }

  ngOnDestroy(): void {
    this.plSub?.unsubscribe();
  }

  ngOnInit(): void {
    this.getPickList();
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

  addPickList(){

  }

  plSub!: Subscription
  pickList : PickList[] = [];
  getPickList(){
    this.plSub = this.salesService.getPickList().subscribe(x=>{
      this.pickList = x;
      console.log(x);
      this.filtered = this.pickList
    })
  }

  filtered!: any[];
  applyFilter(event: Event): void {
    if((event.target as HTMLInputElement).value.trim() === '') {
      this.getPickList();
    }else{
      const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
      this.filtered = this.pickList.filter(element =>
        element.route.routeName.toLowerCase().includes(filterValue)
        || element.id.toString().includes(filterValue)
        || element.status.toLowerCase().includes(filterValue)
        || element.customer.name.toLowerCase().includes(filterValue)
        ||  this.formatDate(element.date).includes(filterValue)
        ||  this.formatDate(element.deliveryDate).includes(filterValue)
      );
    }
  }

  formatDate(date: Date): string {
    // Assuming date is in a standard string format, modify this according to your date format
    const dateObject = new Date(date);
    return dateObject.toLocaleDateString();
  }

  viewPickListDetails(id: number){
    this.router.navigateByUrl('login/sales/routesale/viewpicklist/details/'+id)
  }

  editPickList(id: number){
    this.router.navigateByUrl('/login/sales/routesale/picklist/'+id)
  }

  deletePickList(id: number){}

}
