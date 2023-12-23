import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Store } from '../store/models/store';

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

  uploadStoreImage(file: Blob): Observable<any> {
    if (file instanceof File) {
      const formData = new FormData();
      formData.append("file", file, file.name);
      return this._http.post(this.url + 'fileupload', formData);
    } else {
      // Handle the case where 'file' is not a File object
      return throwError("Invalid file type");
    }
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

  updateStoreImage(file: Blob, data: any): Observable<any> {
    if (file instanceof File) {
      const formData = new FormData();
      formData.append("file", file, file.name);
      return this._http.post(this.url + 'fileupload', formData, data);
    } else {
      // Handle the case where 'file' is not a File object
      return throwError("Invalid file type");
    }
  }

  getStoreByFileUrl(data: any): Observable<Store>{
    const queryParams = new HttpParams().set('fileUrl', data.fileUrl);
    return this._http.get<Store>(this.url+'byfileurl', { params: queryParams });
  }

  deleteStore(id:Number){
    return this._http.delete(this.url+id);
  }
}
