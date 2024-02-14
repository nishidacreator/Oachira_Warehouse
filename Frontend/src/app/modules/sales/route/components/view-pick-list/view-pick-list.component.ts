import { Component, OnDestroy, OnInit } from '@angular/core';
import { SalesService } from '../../../sales.service';
import { Subscription } from 'rxjs';
import { PickList } from '../../models/pick-list';
import { Router } from '@angular/router';
import { DeleteDialogueComponent } from 'src/app/modules/shared-components/delete-dialogue/delete-dialogue.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-view-pick-list',
  templateUrl: './view-pick-list.component.html',
  styleUrls: ['./view-pick-list.component.scss']
})
export class ViewPickListComponent implements OnInit, OnDestroy {

  constructor(private salesService: SalesService, private router: Router, private dialog: MatDialog,
    private _snackBar: MatSnackBar) { }

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
    this.router.navigateByUrl('login/sales/routesale/picklist')
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

  delete!: Subscription;
  deletePickList(id: number){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.delete = this.salesService.deletePickList(id).subscribe((res)=>{
          this.getPickList()
          this._snackBar.open("PickList deleted successfully...","" ,{duration:3000})
        },(error=>{
          this._snackBar.open(error.error.message,"" ,{duration:3000})
        }))
      }
    })

  }

}
