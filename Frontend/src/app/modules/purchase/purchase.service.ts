import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Order } from './models/order';
import { Observable } from 'rxjs';
import { PurchaseRequest } from './models/purchase-request';
import { Entry } from './models/entry';
import { Slip } from './models/slip';
import { Transporter } from './models/transporter';
import { PurchaseTransporter } from './models/purchase-transporter';
import { Broker } from './models/broker';
import { BrokerAccount } from './models/broker-account';
import { LoadingTeam } from './models/loading-team';
import { PurchaseLoading } from './models/purchase-loading';
import { EntryCheque } from './models/entry-cheque';


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

  addPurchaseTransporter(data : any){
    return this._http.post(this.url+ "purchasetransporter", data)
  }

  getPurchaseTransporter(): Observable<PurchaseTransporter[]>{
    return this._http.get<PurchaseTransporter[]>(this.url+'purchasetransporter');
  }

  getPurchaseTransporterById(id: number): Observable<PurchaseTransporter>{
    return this._http.get<PurchaseTransporter>(this.url+'purchasetransporter/'+id);
  }

  getPurchaseTransporterByEntryId(id: number): Observable<PurchaseTransporter>{
    return this._http.get<PurchaseTransporter>(this.url+'purchasetransporter/byentryid/'+id);
  }

  updatePurchaseTransporter(id:Number, data:any){
    return this._http.patch<PurchaseTransporter>(this.url+'purchasetransporter/' + id, data);
  }

  deletePurchaseTransporter(id:Number){
    return this._http.delete(this.url+'purchasetransporter/' +id);
  }

  updatePurchaseTransporterStatus(id:number, data:any){
    return this._http.patch<PurchaseTransporter>(this.url+'purchasetransporter/statusupdate/' + id, data);
  }

  // BROKER
  updateBroker(id:Number, data:any){
    return this._http.patch<Broker>(this.url+'broker/' + id, data);
  }

  deleteBroker(id:Number){
    return this._http.delete(this.url+'broker/' +id);
  }

  getBroker(): Observable<Broker[]>{
    return this._http.get<Broker[]>(this.url+'broker');
  }

  getBrokerById(id: number): Observable<Broker>{
    return this._http.get<Broker>(this.url+'broker/'+id);
  }

  addBroker(data : any){
    return this._http.post(this.url+ "broker", data)
  }

  getBrockerAccountByEntryId(id: number): Observable<BrokerAccount>{
    return this._http.get<BrokerAccount>(this.url+'brokeraccount/byentryid/'+id);
  }

  updateBrokerAccount(id:Number, data:any){
    return this._http.patch<BrokerAccount>(this.url+'brokeraccount/' + id, data);
  }

  deleteBrokerAccount(id:Number){
    return this._http.delete(this.url+'brokeraccount/' +id);
  }

  getBrokerAccount(): Observable<BrokerAccount[]>{
    return this._http.get<BrokerAccount[]>(this.url+'brokeraccount');
  }

  getBrokerAccountById(id: number): Observable<BrokerAccount>{
    return this._http.get<BrokerAccount>(this.url+'brokeraccount/'+id);
  }

  addBrokerAccount(data : any){
    return this._http.post(this.url+ "brokeraccount", data)
  }

  updateBrokerAccountStatus(id:number, data:any){
    return this._http.patch<BrokerAccount>(this.url+'brokeraccount/statusupdate/' + id, data);
  }

  // UNLOADING TEAM
  updateUnloadingTeam(id:Number, data:any){
    return this._http.patch<LoadingTeam>(this.url+'loadingteam/' + id, data);
  }

  deleteUnloadingTeam(id:Number){
    return this._http.delete(this.url+'loadingteam/' +id);
  }

  getUnloadingTeam(): Observable<LoadingTeam[]>{
    return this._http.get<LoadingTeam[]>(this.url+'loadingteam');
  }

  addUnloadingTeam(data : any){
    return this._http.post(this.url+ "loadingteam", data)
  }

  getUnloadingTeamById(id: number): Observable<LoadingTeam>{
    return this._http.get<LoadingTeam>(this.url+'loadingteam/'+id);
  }

  updatePurchaseUnloading(id:Number, data:any){
    return this._http.patch<BrokerAccount>(this.url+'purchaseloading/' + id, data);
  }

  deletePurchaseUnloading(id:Number){
    return this._http.delete(this.url+'purchaseloading/' +id);
  }

  getPurchaseUnloading(): Observable<PurchaseLoading[]>{
    return this._http.get<PurchaseLoading[]>(this.url+'purchaseloading');
  }
  
  getPurchaseUnloadingByEntryId(id: number): Observable<PurchaseLoading>{
    return this._http.get<PurchaseLoading>(this.url+'purchaseloading/byentryid/'+id);
  }

  getPurchaseUnloadingById(id: number): Observable<PurchaseLoading>{
    return this._http.get<PurchaseLoading>(this.url+'purchaseloading/'+id);
  }

  addPurchaseUnloading(data : any){
    return this._http.post(this.url+ "purchaseloading", data)
  }

  updatePurchaseUnloadingStatus(id:number, data:any){
    return this._http.patch<PurchaseLoading>(this.url+'purchaseloading/statusupdate/' + id, data);
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

  //ENTRY CHEQUE
  getEntryChequeByEntryId(id: number): Observable<EntryCheque[]>{
    return this._http.get<EntryCheque[]>(this.url+'entrycheque/byentryid/'+id);
  }

  getEntryCheque(): Observable<EntryCheque[]> {
    return this._http.get<EntryCheque[]>(this.url+'entrycheque');
  }

}
