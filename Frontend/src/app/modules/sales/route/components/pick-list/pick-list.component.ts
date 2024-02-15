import { Component, Inject, OnDestroy, OnInit, Optional } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SalesService } from '../../../sales.service';
import { Subscription } from 'rxjs';
import { Route } from '../../models/route';
import { RouteComponent } from '../route/route.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Customer } from '../../../customers/models/customer';
import { CustomerComponent } from '../../../customers/components/customer/customer.component';
import { TripDaysComponent } from '../trip-days/trip-days.component';
import { TripDays } from '../../models/trip-days';
import { Product } from 'src/app/modules/products/models/product';
import { ProductService } from 'src/app/modules/products/product.service';
import { ProductComponent } from 'src/app/modules/products/components/product/product.component';
import { SecondaryUnit } from 'src/app/modules/products/models/secondary-unit';
import { UsersService } from 'src/app/modules/users/users.service';
import { UnitComponent } from 'src/app/modules/products/components/unit/unit.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pick-list',
  templateUrl: './pick-list.component.html',
  styleUrls: ['./pick-list.component.scss']
})
export class PickListComponent implements OnInit, OnDestroy {

  constructor(private fb: FormBuilder, private salesService: SalesService, private dialog: MatDialog,
    private productService: ProductService, private userService: UsersService, private _snackBar: MatSnackBar,
    @Optional() public dialogRef: MatDialogRef<PickListComponent>, private route: ActivatedRoute,
    @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any
    ) { }

  ngOnDestroy(): void {
  }

  pickListForm = this.fb.group({
    routeId: ['', Validators.required],
    customerId: ['', Validators.required],
    deliveryDate: ['', Validators.required],
    products : this.fb.array([]),
    salesExecutiveId : [0]
  });

  userId!: number;
  ngOnInit(): void {

  }


}
