import { Component, OnDestroy, OnInit } from '@angular/core';
import { Trip } from '../../models/trip';
import { Subscription } from 'rxjs';
import { SalesService } from '../../../sales.service';
import { Router } from '@angular/router';
import { DeleteDialogueComponent } from 'src/app/modules/shared-components/delete-dialogue/delete-dialogue.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-view-trip',
  templateUrl: './view-trip.component.html',
  styleUrls: ['./view-trip.component.scss']
})
export class ViewTripComponent implements OnInit, OnDestroy{

  constructor(private salesService: SalesService, private router: Router, private dialog: MatDialog,
    private _snackBar: MatSnackBar) { }

  ngOnDestroy(): void {
    this.tripSub?.unsubscribe();
  }

  ngOnInit(): void {
    this.getTrip()
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

  addTrip(){
    this.router.navigateByUrl('login/sales/routesale/trip')
  }

  tripSub!: Subscription
  trip : Trip[] = [];
  getTrip(){
    this.tripSub = this.salesService.getTrip().subscribe(x=>{
      this.trip = x;
      console.log(x);
      this.filtered = this.trip
    })
  }

  filtered!: any[];
  applyFilter(event: Event): void {
    if((event.target as HTMLInputElement).value.trim() === '') {
      this.getTrip();
    }else{
      const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
      this.filtered = this.trip.filter(element =>
        element.route.routeName.toLowerCase().includes(filterValue)
        || element.driver.toLowerCase().includes(filterValue)
        || element.salesMan.toLowerCase().includes(filterValue)
        || element.id.toString().includes(filterValue)
        || element.status.toLowerCase().includes(filterValue)
        ||  this.formatDate(element.date).includes(filterValue)
      );
    }
  }

  formatDate(date: Date): string {
    // Assuming date is in a standard string format, modify this according to your date format
    const dateObject = new Date(date);
    return dateObject.toLocaleDateString();
  }

  viewTrip(id: number){
    this.router.navigateByUrl('/login/sales/routesale/viewtrip/details/'+id)
  }

  editTrip(id: number){
    this.router.navigateByUrl('/login/sales/routesale/trip/'+id)
  }

  delete!: Subscription;
  deleteTrip(id: number){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.delete = this.salesService.deleteTrip(id).subscribe((res)=>{
          this.getTrip()
          this._snackBar.open("Trip deleted successfully...","" ,{duration:3000})
        },(error=>{
          this._snackBar.open(error.error.message,"" ,{duration:3000})
        }))
      }
    })

  }

  viewMap(){
    this.router.navigateByUrl('login/sales/routesale/viewmap')
  }

}
