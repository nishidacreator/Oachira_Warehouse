import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Store } from '../store/models/store';
import { Warehouse } from './models/warehouse';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  url = environment.baseUrl + '/store/';

  constructor(private _http:HttpClient) { }

  // STORE
  addStore(data : any){
    return this._http.post(this.url, data)
  }

  getStore(): Observable<Store[]>{
    return this._http.get<Store[]>(this.url);
  }

  getPaginatedStore( search:String, page: number, pageSize: number): Observable<Store[]>{
    return this._http.get<Store[]>(this.url + `?search=${search}&page=${page}&pageSize=${pageSize}`);
  }

  updateStore(id:Number, data:any){
    return this._http.patch<Store>(this.url + id, data);
  }

  deleteStore(id:Number){
    return this._http.delete(this.url+id);
  }

  //WAREHOUSE
  addWarehouse(data : any){
    return this._http.post(this.url + 'warehouse', data)
  }

  getWarehouse(): Observable<Warehouse[]>{
    return this._http.get<Warehouse[]>(this.url+ 'warehouse');
  }

  getPaginatedWarehouse( search:String, page: number, pageSize: number): Observable<Warehouse[]>{
    return this._http.get<Warehouse[]>(this.url + `warehouse/?search=${search}&page=${page}&pageSize=${pageSize}`);
  }

  updatewarehouse(id:Number, data:any){
    return this._http.patch<Warehouse>(this.url + 'warehouse/' + id, data);
  }

  deletewarehouse(id:Number){
    return this._http.delete(this.url+ 'warehouse/'+ id);
  }
}
