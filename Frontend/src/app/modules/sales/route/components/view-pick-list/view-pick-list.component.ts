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
    // this.plSub?.unsubscribe();
  }

  ngOnInit(): void {
    // this.getPickList();
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
