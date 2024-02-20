import { Component, OnDestroy, OnInit } from '@angular/core';
import { SalesService } from '../../../sales.service';
import { RouteEntry } from '../../models/route-entry';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogueComponent } from 'src/app/modules/shared-components/delete-dialogue/delete-dialogue.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-view-route-entry',
  templateUrl: './view-route-entry.component.html',
  styleUrls: ['./view-route-entry.component.scss']
})
export class ViewRouteEntryComponent implements OnInit, OnDestroy {

  constructor(private salesService: SalesService, private router: Router, private dialog: MatDialog,
    private _snackBar: MatSnackBar) { }

  ngOnDestroy(): void {

  }

  ngOnInit(): void {
    this.getRouteEntry()
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

  addRouteEntry(){

  }

  entry: RouteEntry[] = [];
  entrySub!: Subscription;
  getRouteEntry(){
    this.entrySub = this.salesService.getRouteEntry().subscribe(r =>{
      console.log(r);

      this.entry = r;
      this.filtered = r;
    });
  }

  filtered!: any[];
  applyFilter(event: Event): void {
    if((event.target as HTMLInputElement).value.trim() === '') {
      this.getRouteEntry();
    }else{
      const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
      this.filtered = this.entry.filter(element =>
        element.routeSO.route.routeName.toLowerCase().includes(filterValue)
        || element.id.toString().includes(filterValue)
        || element.invoiceNo.toString().includes(filterValue)
        || element.status.toLowerCase().includes(filterValue)
        || element.routeSO.customer.name.toLowerCase().includes(filterValue)
        ||  this.formatDate(element.invoiceDate).includes(filterValue)
        // ||  this.formatDate(element.deliveryDate).includes(filterValue)
      );
    }
  }

  formatDate(date: Date): string {
    // Assuming date is in a standard string format, modify this according to your date format
    const dateObject = new Date(date);
    return dateObject.toLocaleDateString();
  }

  viewRouteEntryDetails(id: number){
    this.router.navigateByUrl('login/sales/routesale/viewrouteentry/details/'+id)
  }

  editRouteEntry(id: number){
    this.router.navigateByUrl('/login/sales/routesale/editrouteentry/'+id)
  }

  delete!: Subscription;
  deleteRouteEntry(id: number){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.delete = this.salesService.deleteRouteEntry(id).subscribe((res)=>{
          this.getRouteEntry()
          this._snackBar.open("RouteEntry deleted successfully...","" ,{duration:3000})
        },(error=>{
          this._snackBar.open(error.error.message,"" ,{duration:3000})
        }))
      }
    })

  }

}
