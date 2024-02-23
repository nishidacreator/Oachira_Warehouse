import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { UnitComponent } from 'src/app/modules/products/components/unit/unit.component';
import { PrimaryUnit } from 'src/app/modules/products/models/primary-unit';
import { SecondaryUnit } from 'src/app/modules/products/models/secondary-unit';
import { ProductService } from 'src/app/modules/products/product.service';
import { CustomerGradeComponent } from 'src/app/modules/sales/customers/components/customer-grade/customer-grade.component';
import { CustomerGrade } from 'src/app/modules/sales/customers/models/customer-grade';
import { SalesService } from 'src/app/modules/sales/sales.service';
import { DeleteDialogueComponent } from 'src/app/modules/shared-components/delete-dialogue/delete-dialogue.component';
import { PurchaseService } from '../../purchase.service';
import { ActivatedRoute } from '@angular/router';
import { Slip } from '../../models/slip';

@Component({
  selector: 'app-slip',
  templateUrl: './slip.component.html',
  styleUrls: ['./slip.component.scss']
})
export class SlipComponent implements OnInit {

  constructor(public purchaseService: PurchaseService, public dialog: MatDialog, private route: ActivatedRoute){}

  ngOnDestroy() {
    this.slipSub?.unsubscribe();
  }


  ngOnInit(): void {
    this.getSlipById()
  }

  slips!: Slip;
  slipSub!: Subscription;
  getSlipById(){
    this.slipSub = this.purchaseService.getSlipById(this.route.snapshot.params['id']).subscribe(slip => {
      this.slips = slip
      console.log(this.slips);

    })
  }

  printDiv() {
    var divContents = document.getElementById("return-slip")?.innerHTML;
    const contentHeight = this.calculateContentHeight(); // Add a function to calculate content height
    console.log(contentHeight);
    var a = window.open('', '', ' width=500px');
    if(divContents){
      a?.document.write('<html>');
      a?.document.write('<body style="display:flex; size: auto">');
      a?.document.write(divContents);
      a?.document.write('</body></html>');
      a?.document.close();
      a?.print();
    }
  }


  calculateContentHeight() {
    // Add logic to calculate the content height dynamically
    // You may use document.body.scrollHeight or any other suitable method
    // Adjust this logic based on your specific requirements
    return document.body.scrollHeight;
  }
}

