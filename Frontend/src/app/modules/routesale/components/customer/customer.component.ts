import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { RoutesaleService } from '../../routesale.service';
import { Subscription } from 'rxjs';
import { Category } from 'src/app/modules/products/models/category';
import { CustomerCategory } from '../../models/customer-category';
import { CustomerGrade } from '../../models/customer-grade';
import { Customer } from '../../models/customer';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit, OnDestroy {

  constructor(private fb: FormBuilder, private rsService: RoutesaleService) { }

  ngOnDestroy(): void {
    this.catSub?.unsubscribe();
    this.gradeSub?.unsubscribe();
    this.customerSub?.unsubscribe();
  }

  customerForm = this.fb.group({
    name : [''],
    phoneNumber : [''],
    address1 : [''],
    address2 : [''],
    state : [''],
    loyaltyPoint : [''],
    customerCategoryId : [],
    customerGradeId : []
  });

  ngOnInit(): void {
  }

  catSub!: Subscription;
  category: CustomerCategory[] = [];
  getCategory(){
    this.catSub = this.rsService.getCustomerCategory().subscribe(res=>{
      this.category = res;
    })
  }

  addCategory(){}

  gradeSub!: Subscription;
  grade: CustomerGrade[] = [];
  getGrade(){
    this.gradeSub = this.rsService.getCustomerGrade().subscribe(res=>{
      this.grade = res;
    });
  }

  addGrade(){}

  onSubmit(){}

  customer: Customer[] = [];
  customerSub!: Subscription;
  getCustomer(){
    this.customerSub = this.rsService.getCustomer().subscribe(res=>{
      this.customer = res;
      this.filtered = this.customer
    });
  }

  filterValue: any;
  filtered!: any[];
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filterValue = filterValue;
    this.filtered = this.customer.filter(element =>
      element.name.toLowerCase().includes(filterValue)
      || element.id.toString().includes(filterValue)
      || element.customerCategory.categoryName.toLowerCase().includes(filterValue)
      || element.customerGrade.grade.toLowerCase().includes(filterValue)
      || element.subledgerCode.toLowerCase().includes(filterValue)
      || element.state.toLowerCase().includes(filterValue)
    );
  }

  isEdit : boolean = false;

  editFunction(){}

}
