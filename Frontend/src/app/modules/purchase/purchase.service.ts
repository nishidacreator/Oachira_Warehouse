import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Order } from './models/order';
import { Observable } from 'rxjs';
import { PurchaseRequest } from './models/purchase-request';
import { Entry } from './models/entry';
import { Slip } from './models/slip';
import { Transporter } from './models/transporter';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  url = environment.baseUrl + '/purchases/';

  constructor(private _http:HttpClient) { }


  updateTransporter(id:Number, data:any){
    return this._http.patch<Transporter>(this.url+'transporter/' + id, data);
  }

  deleteTransporter(id:Number){
    return this._http.delete(this.url+'transporter/' +id);
  }

  getTransporters(): Observable<Transporter[]>{
    return this._http.get<Transporter[]>(this.url+'transporter');
  }

  addTransporter(data : any){
    return this._http.post(this.url+ "transporter", data)
  }
  //PR
  addPR(data : any){
    return this._http.post(this.url + 'request', data)
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

  getPO(): Observable<Order[]>{
    return this._http.get<Order[]>(this.url+'order');
  }

  getPOById(id: number): Observable<Order>{
    return this._http.get<Order>(this.url+'order/'+ id);
  }

  deletePO(id:Number){
    return this._http.delete(this.url+'order/'+id);
  }

  updatePO(id:Number, data:any){
    return this._http.patch<Order>(this.url+'order/'+id, data);
  }

  //PE
  addPE(data : any){
    return this._http.post(this.url + 'entry', data)
  }

  updatePE(id:Number, data:any){
    return this._http.patch<Entry>(this.url+'entry/'+id, data);
  }

  getPe(): Observable<Entry[]>{
    return this._http.get<Entry[]>(this.url+'entry');
  }

  getPeById(id: number): Observable<Entry>{
    return this._http.get<Entry>(this.url+'entry/' + id);
  }

  updatePEStatus(id:Number, data:any){
    return this._http.patch<Entry>(this.url+'entry/statusupdate/'+id, data);
  }

  addPEDetails(data : any){
    return this._http.post(this.url + 'pentrydetails', data)
  }

  //SLIP
  addSlip( data : any){
    return this._http.post(this.url + 'slip', data)
  }

  getSlip(): Observable<Slip[]>{
    return this._http.get<Slip[]>(this.url+'slip');
  }

  getSlipById(id: number): Observable<Slip>{
    return this._http.get<Slip>(this.url+'slip/'+id);
  }

  deleteSlip(id:Number){
    return this._http.delete(this.url+'slip/'+id);
  }

  updateSlip(id:Number, data:any){
    return this._http.patch<Slip>(this.url+'slip/'+id, data);
  }

}
