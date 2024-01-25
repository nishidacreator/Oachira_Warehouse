import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoyaltyPoint } from './models/loyalty-point';
import { Observable } from 'rxjs';
import { Customer } from './models/customer';
import { CustomerCategory } from './models/customer-category';
import { CustomerGrade } from './models/customer-grade';

@Injectable({
  providedIn: 'root'
})
export class RoutesaleService {

  url = environment.baseUrl + '/routesale/';

  constructor(private _http:HttpClient) { }

  //CUSTOMER
  addCustomer(data : any){
    return this._http.post(this.url + 'customer', data)
  }

  getCustomer(): Observable<Customer[]>{
    return this._http.get<Customer[]>(this.url+'customer');
  }

  deleteCustomer(id:Number){
    return this._http.delete(this.url+'customer/'+id);
  }

  updateCustomer(id:Number, data:any){
    return this._http.patch<Customer>(this.url+'customer/'+id, data);
  }

  //LOYALTY POINT
  addLoyaltyPoint(data : any){
    return this._http.post(this.url + 'loyaltypoint', data)
  }

  getLoyaltyPoint(): Observable<LoyaltyPoint[]>{
    return this._http.get<LoyaltyPoint[]>(this.url+'loyaltypoint');
  }

  deleteLoyaltyPoint(id:Number){
    return this._http.delete(this.url+'loyaltypoint/'+id);
  }

  updateLoyaltyPoint(id:Number, data:any){
    return this._http.patch<LoyaltyPoint>(this.url+'loyaltypoint/'+id, data);
  }

  //CUSTOMER CATEGORY
  addCustomerCategory(data : any){
    return this._http.post(this.url + 'customercategory', data)
  }

  getCustomerCategory(): Observable<CustomerCategory[]>{
    return this._http.get<CustomerCategory[]>(this.url+'customercategory');
  }

  deleteCustomerCategory(id:Number){
    return this._http.delete(this.url+'customercategory/'+id);
  }

  updateCustomerCategory(id:Number, data:any){
    return this._http.patch<CustomerCategory>(this.url+'customercategory/'+id, data);
  }

  //CUSTOMER GRADE
  addCustomerGrade(data : any){
    return this._http.post(this.url + 'customergrade', data)
  }

  getCustomerGrade(): Observable<CustomerGrade[]>{
    return this._http.get<CustomerGrade[]>(this.url+'customergrade');
  }

  deleteCustomerGrade(id:Number){
    return this._http.delete(this.url+'customergrade/'+id);
  }

  updateCustomerGrade(id:Number, data:any){
    return this._http.patch<CustomerGrade>(this.url+'customergrade/'+id, data);
  }
}
