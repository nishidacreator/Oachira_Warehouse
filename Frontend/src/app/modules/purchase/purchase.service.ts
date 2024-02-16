import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PurchaseOrder } from './models/purchase-order';
import { Observable } from 'rxjs';
import { PurchaseRequest } from './models/purchase-request';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  url = environment.baseUrl + '/purchases/';

  constructor(private _http:HttpClient) { }

  //PR
  addPR(data : any){
    return this._http.post(this.url + 'request', data)
  }

  //PE
  addPE(data : any){
    return this._http.post(this.url + 'entry', data)

  }

  getPR(): Observable<PurchaseRequest[]>{
    return this._http.get<PurchaseRequest[]>(this.url+'request');
  }

  getPRById(id: number): Observable<PurchaseRequest>{
    return this._http.get<PurchaseRequest>(this.url+'request/byid/'+id);
  }

  deletePR(id:Number){
    return this._http.delete(this.url+'request/'+id);
  }

  updatePR(id:Number, data:any){
    return this._http.patch<PurchaseRequest>(this.url+'request/'+id, data);
  }

  //PO
  addPO(data : any){
    return this._http.post(this.url + 'order', data)
  }

  getPO(): Observable<PurchaseOrder[]>{
    return this._http.get<PurchaseOrder[]>(this.url+'order');
  }

  deletePO(id:Number){
    return this._http.delete(this.url+'order/'+id);
  }

  updatePO(id:Number, data:any){
    return this._http.patch<PurchaseOrder>(this.url+'order/'+id, data);
  }
}
