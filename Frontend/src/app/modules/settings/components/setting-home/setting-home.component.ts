import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ManageComponent } from 'src/app/modules/products/components/manage/manage.component';
import { ProductsModule } from 'src/app/modules/products/products.module';

@Component({
  selector: 'app-setting-home',
  templateUrl: './setting-home.component.html',
  styleUrls: ['./setting-home.component.scss']
})
export class SettingHomeComponent implements OnInit {

  constructor(private dialog: MatDialog, private router: Router) { }

  ngOnInit(): void {
  }

  manageProducts() {
    // Open the dialog
    const dialogRef = this.dialog.open(ProductsModule, {
      height: '200px',
      width: '800px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      // Navigate to the 'product' route after the dialog is closed
      this.router.navigate(['product']);
    });
  }
}
