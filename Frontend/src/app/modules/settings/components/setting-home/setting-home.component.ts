import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddComponent } from 'src/app/modules/products/components/add/add.component';
import { ManageComponent } from 'src/app/modules/products/components/manage/manage.component';

@Component({
  selector: 'app-setting-home',
  templateUrl: './setting-home.component.html',
  styleUrls: ['./setting-home.component.scss']
})
export class SettingHomeComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  manageProducts(){
    const dialogRef = this.dialog.open(ManageComponent, {
      height: '200px',
      width: '800px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    })
  }
}
