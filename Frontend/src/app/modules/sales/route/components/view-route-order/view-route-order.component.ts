import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DeleteDialogueComponent } from 'src/app/modules/shared-components/delete-dialogue/delete-dialogue.component';
import { SalesService } from '../../../sales.service';
import { RouteOrder } from '../../models/route-order';

@Component({
  selector: 'app-view-route-order',
  templateUrl: './view-route-order.component.html',
  styleUrls: ['./view-route-order.component.scss']
})
export class ViewRouteOrderComponent implements OnInit {

  constructor(private salesService: SalesService, private router: Router, private dialog: MatDialog,
    private _snackBar: MatSnackBar) { }

  ngOnDestroy(): void {
    this.plSub?.unsubscribe();
  }

  ngOnInit(): void {
    this.getRouteOrder();
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

  addRouteOrder(){
    this.router.navigateByUrl('login/sales/routesale/routeorder')
  }

  plSub!: Subscription
  routeOrder : RouteOrder[] = [];
  getRouteOrder(){
    this.plSub = this.salesService.getRouteOrder().subscribe(x=>{
      this.routeOrder = x;
      console.log(x);
      this.filtered = this.routeOrder
    })
  }

  filtered!: any[];
  applyFilter(event: Event): void {
    if((event.target as HTMLInputElement).value.trim() === '') {
      this.getRouteOrder();
    }else{
      const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
      this.filtered = this.routeOrder.filter(element =>
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

  viewRouteOrderDetails(id: number){
    this.router.navigateByUrl('login/sales/routesale/viewrouteorder/details/'+id)
  }

  editRouteOrder(id: number){
    this.router.navigateByUrl('/login/sales/routesale/routeorder/'+id)
  }

  delete!: Subscription;
  deleteRouteOrder(id: number){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.delete = this.salesService.deleteRouteOrder(id).subscribe((res)=>{
          this.getRouteOrder()
          this._snackBar.open("RouteOrder deleted successfully...","" ,{duration:3000})
        },(error=>{
          this._snackBar.open(error.error.message,"" ,{duration:3000})
        }))
      }
    })

  }

  generateRSE(id: number){
    console.log(id);

    this.router.navigateByUrl('/login/sales/routesale/routeentry/'+id)
  }

}
