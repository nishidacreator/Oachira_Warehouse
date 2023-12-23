import { Location } from './models/location';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Category } from './models/category';
import { SubCategory } from './models/sub-category';
import { Brand } from './models/brand';
import { PrimaryUnit } from './models/primary-unit';
import { SecondaryUnit } from './models/secondary-unit';
import { Product } from './models/product';
import { Gst } from './models/gst';
import { Hsn } from './models/hsn';
import { ProductDistributor } from './models/product-distributor';

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

  getSubCategory(): Observable<SubCategory[]>{
    return this._http.get<SubCategory[]>(this.url+'subcategory');
  }

  getPaginatedSubCategory( search:String, page: number, pageSize: number): Observable<SubCategory[]>{
    return this._http.get<SubCategory[]>(this.url + `subcategory?search=${search}&page=${page}&pageSize=${pageSize}`);
  }

  updateSubCategory(id:Number, data:any){
    return this._http.patch<SubCategory>(this.url+'subcategory/' + id, data);
  }

  updateSubCategoryImage(file: Blob, data: any): Observable<any> {
    if (file instanceof File) {
      const formData = new FormData();
      formData.append("file", file, file.name);
      return this._http.post(this.url + 'subcategory/fileupload', formData, data);
    } else {
      // Handle the case where 'file' is not a File object
      return throwError("Invalid file type");
    }
  }

  getSubCategoryByFileUrl(data: any): Observable<SubCategory>{
    const queryParams = new HttpParams().set('fileUrl', data.fileUrl);
    return this._http.get<SubCategory>(this.url+'subcategory/byfileurl', { params: queryParams });
  }

  deleteSubCategory(id:Number){
    return this._http.delete(this.url+'subcategory/'+id);
  }

  // BRANDS
  addBrand(data : any){
    return this._http.post(this.url + 'brand', data)
  }

  uploadBrandImage(file: Blob): Observable<any> {
    if (file instanceof File) {
      const formData = new FormData();
      formData.append("file", file, file.name);
      return this._http.post(this.url + 'brand/fileupload', formData);
    } else {
      // Handle the case where 'file' is not a File object
      return throwError("Invalid file type");
    }
  }

  getBrand(): Observable<Brand[]>{
    return this._http.get<Brand[]>(this.url+'brand');
  }

  getPaginatedBrand( search:String, page: number, pageSize: number): Observable<Brand[]>{
    return this._http.get<Brand[]>(this.url + `brand?search=${search}&page=${page}&pageSize=${pageSize}`);
  }

  updateBrand(id:Number, data:any){
    return this._http.patch<Brand>(this.url+'brand/' + id, data);
  }

  updateBrandImage(file: Blob, data: any): Observable<any> {
    if (file instanceof File) {
      const formData = new FormData();
      formData.append("file", file, file.name);
      return this._http.post(this.url + 'brand/fileupload', formData, data);
    } else {
      // Handle the case where 'file' is not a File object
      return throwError("Invalid file type");
    }
  }

  getBrandByFileUrl(data: any): Observable<Brand>{
    const queryParams = new HttpParams().set('fileUrl', data.fileUrl);
    return this._http.get<Brand>(this.url+'brand/byfileurl', { params: queryParams });
  }

  deleteBrand(id:Number){
    return this._http.delete(this.url+'brand/'+id);
  }

  // UNIT
  addPrimaryUnit(data : any){
    return this._http.post(this.url + 'primaryUnit', data)
  }

  getPrimaryUnit(): Observable<PrimaryUnit[]>{
    return this._http.get<PrimaryUnit[]>(this.url+'primaryunit');
  }

  deletePUnit(id:Number){
    return this._http.delete(this.url+'primaryunit/'+id);
  }

  updatePUnit(id:Number, data:any){
    return this._http.patch<PrimaryUnit>(this.url+'primaryunit/'+id, data);
  }

  addSecondaryUnit(data : any){
    return this._http.post(this.url + 'secondaryUnit', data)
  }

  getSecondaryUnit(): Observable<SecondaryUnit[]>{
    return this._http.get<SecondaryUnit[]>(this.url+'secondaryunit');
  }

  deleteSUnit(id:Number){
    return this._http.delete(this.url+'secondaryunit/'+id);
  }

  updateSUnit(id:Number, data:any){
    return this._http.patch<SecondaryUnit>(this.url+'secondaryUnit/'+id, data);
  }

  //LOCATION
  addLocation(data : any){
    return this._http.post(this.url + 'location', data)
  }

  getLocation(): Observable<Location[]>{
    return this._http.get<Location[]>(this.url + 'location');
  }

  deleteLocation(id:Number){
    return this._http.delete(this.url+'location/'+id);
  }

  updateLocation(id:Number, data:any){
    return this._http.patch<Location>(this.url+'location/'+id, data);
  }

  // PRODUCT
  addProduct(data : any){
    return this._http.post(this.url, data)
  }

  uploadProductImage(file: Blob): Observable<any> {
    if (file instanceof File) {
      const formData = new FormData();
      formData.append("file", file, file.name);
      return this._http.post(this.url + '/fileupload', formData);
    } else {
      // Handle the case where 'file' is not a File object
      return throwError("Invalid file type");
    }
  }

  getProduct(): Observable<Product[]>{
    return this._http.get<Product[]>(this.url);
  }

  getPaginatedProduct(search:string, page: number, pageSize: number): Observable<Product[]>{
    return this._http.get<Product[]>(this.url + `?search=${search}&page=${page}&pageSize=${pageSize}`);
  }

  updateProduct(id:Number, data:any){
    return this._http.patch<Product>(this.url+'/' + id, data);
  }

  updateProductImage(file: Blob, data: any): Observable<any> {
    if (file instanceof File) {
      const formData = new FormData();
      formData.append("file", file, file.name);
      return this._http.post(this.url + 'fileupload', formData, data);
    } else {
      // Handle the case where 'file' is not a File object
      return throwError("Invalid file type");
    }
  }

  getProductByFileUrl(data: any): Observable<Product>{
    const queryParams = new HttpParams().set('fileUrl', data.fileUrl);
    return this._http.get<Product>(this.url+'byfileurl', { params: queryParams });
  }

  deleteProduct(id:Number){
    return this._http.delete(this.url+'/'+id);
  }

  //GST
  addGst(data : any){
    return this._http.post(this.url + 'gst', data)
  }

  getGst(): Observable<Gst[]>{
    return this._http.get<Gst[]>(this.url + 'gst');
  }

  deleteGst(id:Number){
    return this._http.delete(this.url+'gst/'+id);
  }

  updateGst(id:Number, data:any){
    return this._http.patch<Gst>(this.url+'gst/'+id, data);
  }

  //HSN
  addHsn(data : any){
    return this._http.post(this.url + 'hsn', data)
  }

  getHsn(): Observable<Hsn[]>{
    return this._http.get<Hsn[]>(this.url + 'hsn');
  }

  deleteHsn(id:Number){
    return this._http.delete(this.url+'hsn/'+id);
  }

  updateHsn(id:Number, data:any){
    return this._http.patch<Hsn>(this.url+'hsn/'+id, data);
  }

  // DISTRIBUTOR
  addDistributor(data : any){
    return this._http.post(this.url + 'distributor', data)
  }

  uploadDistributorImage(file: Blob): Observable<any> {
    if (file instanceof File) {
      const formData = new FormData();
      formData.append("file", file, file.name);
      return this._http.post(this.url + 'distributor/fileupload', formData);
    } else {
      // Handle the case where 'file' is not a File object
      return throwError("Invalid file type");
    }
  }

  getDistributor(): Observable<Brand[]>{
    return this._http.get<Brand[]>(this.url+'distributor');
  }

  getPaginatedDistributor( search:String, page: number, pageSize: number): Observable<Brand[]>{
    return this._http.get<Brand[]>(this.url + `distributor?search=${search}&page=${page}&pageSize=${pageSize}`);
  }

  updateDistributor(id:Number, data:any){
    return this._http.patch<Brand>(this.url+'distributor/' + id, data);
  }

  updateDistributorImage(file: Blob, data: any): Observable<any> {
    if (file instanceof File) {
      const formData = new FormData();
      formData.append("file", file, file.name);
      return this._http.post(this.url + 'distributor/fileupload', formData, data);
    } else {
      // Handle the case where 'file' is not a File object
      return throwError("Invalid file type");
    }
  }

  getDistributorByFileUrl(data: any): Observable<Brand>{
    const queryParams = new HttpParams().set('fileUrl', data.fileUrl);
    return this._http.get<Brand>(this.url+'distributor/byfileurl', { params: queryParams });
  }

  deleteDistributor(id:Number){
    return this._http.delete(this.url+'distributor/'+id);
  }

  getProductsByDistributor(id: number): Observable<ProductDistributor[]>{
    return this._http.get<ProductDistributor[]>(this.url+'productdistributor/byditsributorid/' + id);
  }

  // PRODUCT DISTRIBUTOR
  addProductDistributor(data : any){
    return this._http.post(this.url + 'productdistributor', data)
  }

  deleteProductDistributor(id : number){
    return this._http.delete(this.url + 'productdistributor/'+ id )
  }

  updateProductDistributorStatus(data: any, id : number){
    return this._http.patch(this.url + 'productdistributor/status/'+ id, data )
  }
}
