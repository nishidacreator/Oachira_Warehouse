import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Category } from './models/category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  url = environment.baseUrl + '/product/';

  constructor(private _http:HttpClient) { }

  // CATEGORY
  addCategory(data : any){
    return this._http.post(this.url + 'category', data)
  }

  uploadCategoryImage(file: Blob): Observable<any> {
    if (file instanceof File) {
      const formData = new FormData();
      formData.append("file", file, file.name);
      return this._http.post(this.url + 'category/fileupload', formData);
    } else {
      // Handle the case where 'file' is not a File object
      return throwError("Invalid file type");
    }
  }

  getCategory(): Observable<Category[]>{
    return this._http.get<Category[]>(this.url+'category');
  }

  getCategoryByFileUrl(data: any): Observable<Category>{
    const queryParams = new HttpParams().set('fileUrl', data.fileUrl);
    return this._http.get<Category>(this.url+'category/byfileurl', { params: queryParams });
  }

  getPaginatedCategory( search:String, page: number, pageSize: number): Observable<Category[]>{
    return this._http.get<Category[]>(this.url + `category?search=${search}&page=${page}&pageSize=${pageSize}`);
  }

  updateCategoryImage(file: Blob, data: any): Observable<any> {
    if (file instanceof File) {
      const formData = new FormData();
      formData.append("file", file, file.name);
      return this._http.post(this.url + 'category/fileupload', formData, data);
    } else {
      // Handle the case where 'file' is not a File object
      return throwError("Invalid file type");
    }
  }

  updateCategory(id:Number, data:any){
    return this._http.patch<Category>(this.url+'category/' + id, data);
  }

  deleteCatImage(data: any){
    const queryParams = new HttpParams().set('fileUrl', data);
    return this._http.delete(this.url + 'category/filedelete', { params: queryParams });
  }

  deleteCategory(id:Number){
    return this._http.delete(this.url+'category/'+id);
  }
  // SUBCATEGORY
  addSubCategory(data : any){
    return this._http.post(this.url + 'subcategory', data)
  }

  uploadSubCategoryImage(file: Blob): Observable<any> {
    if (file instanceof File) {
      const formData = new FormData();
      formData.append("file", file, file.name);
      return this._http.post(this.url + 'subcategory/fileupload', formData);
    } else {
      // Handle the case where 'file' is not a File object
      return throwError("Invalid file type");
    }
  }

  getSubCategory(): Observable<Category[]>{
    return this._http.get<Category[]>(this.url+'subcategory');
  }

  getPaginatedSubCategory( search:String, page: number, pageSize: number): Observable<Category[]>{
    return this._http.get<Category[]>(this.url + `subcategory?search=${search}&page=${page}&pageSize=${pageSize}`);
  }

}
