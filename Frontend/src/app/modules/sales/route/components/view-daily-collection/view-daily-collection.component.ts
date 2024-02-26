import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DeleteDialogueComponent } from 'src/app/modules/shared-components/delete-dialogue/delete-dialogue.component';
import { SalesService } from '../../../sales.service';
import { RouteEntry } from '../../models/route-entry';
import { DailyCollection } from '../../models/daily-collection';

@Component({
  selector: 'app-view-daily-collection',
  templateUrl: './view-daily-collection.component.html',
  styleUrls: ['./view-daily-collection.component.scss']
})
export class ViewDailyCollectionComponent implements OnInit {


  constructor(private salesService: SalesService, private router: Router, private dialog: MatDialog,
    private _snackBar: MatSnackBar) { }

  ngOnDestroy(): void {
    this.dailyCollectionSub.unsubscribe();
    this.dailyCollectionSub.unsubscribe();

  }

  ngOnInit(): void {
    this.getRouteEntry();
    this.getDailyCollection();
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

  addDailyCollection(){
    this.router.navigateByUrl('login/sales/routesale/dailyCollection')


  }

  dailyCollection: DailyCollection[] = [];
  collectionSub!: Subscription;
  getRouteEntry(){
    this.collectionSub = this.salesService.getDailyCollection().subscribe(res =>{
      console.log('GET API ',res);

      this.dailyCollection = res;
      this.filtered = res;
    });
  }

  filtered!: any[];
  // applyFilter(event: Event): void {
  //   if((event.target as HTMLInputElement).value.trim() === '') {
  //     this.getRouteEntry();
  //   }else{
  //     const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
  //     this.filtered = this.entry.filter(element =>
  //       element.routeSO.route.routeName.toLowerCase().includes(filterValue)
  //       || element.id.toString().includes(filterValue)
  //       || element.invoiceNo.toString().includes(filterValue)
  //       || element.status.toLowerCase().includes(filterValue)
  //       || element.routeSO.customer.name.toLowerCase().includes(filterValue)
  //       ||  this.formatDate(element.invoiceDate).includes(filterValue)
    
  //     );
  //   }
  // }

  formatDate(date: Date): string {
    // Assuming date is in a standard string format, modify this according to your date format
    const dateObject = new Date(date);
    return dateObject.toLocaleDateString();
  }
collections : DailyCollection[]=[]
  dailyCollectionSub!: Subscription;
getDailyCollection(){
  this.dailyCollectionSub = this.salesService.getDailyCollection().subscribe((res)=>{
    this.dailyCollection = res;

  })

}
  viewDailyCollection(id:number){
    this.router.navigateByUrl('login/sales/routesale/detailViewDailyCollection/'+id)

  }
   editDailyCollection(id:number){
    this.router.navigateByUrl('/login/sales/routesale/editDailyCollection/'+id)

}


delete!: Subscription;

deleteDailyCollection(id: number) {
  const dialogRef = this.dialog.open(DeleteDialogueComponent, {
    data: {}
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result === true) {
      console.log(id)
      this.delete = this.salesService.deleteDailyCollection(id).subscribe(
    
        (res) => {
          this.getDailyCollection();

          this._snackBar.open("Daily collection deleted successfully...", "", { duration: 3000 });
          this.getDailyCollection();
        },
        (error) => {
          console.error('Error:', error); // Log the entire error object
          const errorMessage = "An error occurred";
          this._snackBar.open(errorMessage, "", { duration: 3000 });
        }
      );
    }
  });
}



  viewRouteEntryDetails(id: number){
    this.router.navigateByUrl('login/sales/routesale/detailViewDailyCollection/'+id)
  }

  editRouteEntry(id: number){
    this.router.navigateByUrl('/login/sales/routesale/editDailyCollection/'+id)
  }

 
  

}

