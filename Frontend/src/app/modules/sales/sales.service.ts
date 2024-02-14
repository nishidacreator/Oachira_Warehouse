import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Category } from '../products/models/category';
import { CustomerCategory } from './customers/models/customer-category';
import { CustomerGrade } from './customers/models/customer-grade';
import { Customer } from './customers/models/customer';
import { RouteDetails } from './route/models/route-details';
import { Vehicle } from './route/models/vehicle';
import { VehicleType } from './route/models/vehicle-type';
import { Route } from './route/models/route';
import { TripDays } from './route/models/trip-days';
import { PickList } from './route/models/pick-list';
import { RouteDays } from './route/models/route-days';
import { Trip } from './route/models/trip';
import { PickListDetails } from './route/models/pick-list-details';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  url = environment.baseUrl + '/sales/';

  constructor(private _http:HttpClient) { }

  // CATEGORY
  addCustomerCategory(data : any){
    return this._http.post(this.url + 'customercategory', data)
  }

  getCustomerCategory(): Observable<CustomerCategory[]>{
    return this._http.get<CustomerCategory[]>(this.url+'customercategory');
  }

  getPaginatedCustomerCategory( search:String, page: number, pageSize: number): Observable<CustomerCategory[]>{
    return this._http.get<CustomerCategory[]>(this.url + `customercategory?search=${search}&page=${page}&pageSize=${pageSize}`);
  }

  updateCustomerCategory(id:number, data:any){
    return this._http.patch<CustomerCategory>(this.url+'customercategory/' + id, data);
  }

  updateCustomerCategoryStatus(id:number, data:any){
    return this._http.patch<CustomerCategory>(this.url+'customercategory/statusupdate/' + id, data);
  }

  deleteCustomerCategory(id:number){
    return this._http.delete(this.url+'customercategory/'+id);
  }

   // GRADE
   addCustomerGrade(data : any){
    return this._http.post(this.url + 'customergrade', data)
  }

  getCustomerGrade(): Observable<CustomerGrade[]>{
    return this._http.get<CustomerGrade[]>(this.url+'customergrade');
  }

  getPaginatedCustomerGrade( search:String, page: number, pageSize: number): Observable<CustomerGrade[]>{
    return this._http.get<CustomerGrade[]>(this.url + `customergrade?search=${search}&page=${page}&pageSize=${pageSize}`);
  }

  updateCustomerGrade(id:number, data:any){
    return this._http.patch<CustomerGrade>(this.url+'customergrade/' + id, data);
  }

  updateCustomerGradeStatus(id:number, data:any){
    return this._http.patch<CustomerGrade>(this.url+'customergrade/statusupdate/' + id, data);
  }

  deleteCustomerGrade(id:number){
    return this._http.delete(this.url+'customergrade/'+id);
  }

  // CUSTOMER
  addCustomer(data : any){
    return this._http.post(this.url + 'customer', data)
  }

  getCustomer(): Observable<Customer[]>{
    return this._http.get<Customer[]>(this.url+'customer');
  }

  getPaginatedCustomer( search:String, page: number, pageSize: number): Observable<Customer[]>{
    return this._http.get<Customer[]>(this.url + `customer?search=${search}&page=${page}&pageSize=${pageSize}`);
  }

  updateCustomer(id:number, data:any){
    return this._http.patch<Customer>(this.url+'customer/' + id, data);
  }

  updateCustomerStatus(id:number, data:any){
    return this._http.patch<Customer>(this.url+'customer/statusupdate/' + id, data);
  }

  deleteCustomer(id:number){
    return this._http.delete(this.url+'customer/'+id);
  }

  addVehicleType(data: any){
    return this._http.post(this.url + 'vehicletype', data);
  }

  getVehicleType(): Observable<VehicleType[]>{
    return this._http.get<VehicleType[]>(this.url +'vehicletype');
  }

  getVehicleTypeById(id: number): Observable<VehicleType>{
    return this._http.get<VehicleType>(this.url +'vehicletype/' + id);
  }

  deleteVehicleType(id : Number){
    return this._http.delete(this.url+'vehicletype/'+ id);
  }

  updateVehicleType(id:Number, data:any): Observable<VehicleType>{
    return this._http.patch<VehicleType>(this.url+'vehicletype/'+id, data);
  }

  addVehicle(data : any){
    return this._http.post(this.url +'vehicle', data);
  }

  getVehicle(): Observable<Vehicle[]>{
    return this._http.get<Vehicle[]>(this.url +'vehicle');
  }

  getVehicleById(id: number): Observable<Vehicle>{
    return this._http.get<Vehicle>(this.url +'vehicle/' + id);
  }

  getPaginatedVehicle( search:String, page: number, pageSize: number): Observable<Vehicle[]>{
    return this._http.get<Vehicle[]>(this.url + `vehicle?search=${search}&page=${page}&pageSize=${pageSize}`);
  }

  deleteVehicle(id : Number){
    return this._http.delete(this.url+'vehicle/'+ id);
  }

  updateVehicle(id:Number, data:any): Observable<Vehicle>{
    return this._http.patch<Vehicle>(this.url+'vehicle/'+id, data);
  }

  updateVehicleStatus(id:Number, data:any): Observable<Vehicle>{
    return this._http.patch<Vehicle>(this.url+'vehicle/statusupdate/'+id, data);
  }


  //Route
  addRoute(data : any){
    return this._http.post(this.url +'route', data);
  }

  getRoute(): Observable<Route[]>{
    return this._http.get<Route[]>(this.url +'route');
  }

  getPaginatedRoute( search:String, page: number, pageSize: number): Observable<Route[]>{
    return this._http.get<Route[]>(this.url + `route?search=${search}&page=${page}&pageSize=${pageSize}`);
  }

  getRouteById(id: number): Observable<Route>{
    return this._http.get<Route>(this.url +'route/'+id);
  }

  getRouteByUserId(id: number): Observable<Route[]>{
    return this._http.get<Route[]>(this.url +'route/byuserid/'+id);
  }

  deleteRoute(id : Number){
    return this._http.delete(this.url+'route/'+ id);
  }

  updateRoute(id:Number, data:any): Observable<Route>{
    return this._http.patch<Route>(this.url+'route/'+id, data);
  }

  updateRouteStatus(id:number, data:any){
    return this._http.patch<Route>(this.url+'route/statusupdate/' + id, data);
  }

  addRouteDays(data : any){
    return this._http.post(this.url +'routedays', data);
  }

  getRouteDays(): Observable<RouteDays[]>{
    return this._http.get<RouteDays[]>(this.url +'routedays');
  }

  getPaginatedRouteDays( search:String, page: number, pageSize: number): Observable<RouteDays[]>{
    return this._http.get<RouteDays[]>(this.url + `routedays?search=${search}&page=${page}&pageSize=${pageSize}`);
  }

  getRouteDayById(id: number): Observable<RouteDays>{
    return this._http.get<RouteDays>(this.url +'routedays/'+id);
  }

  getRouteDayByRouteId(id: number): Observable<RouteDays[]>{
    return this._http.get<RouteDays[]>(this.url +'routedays/byrouteid/'+id);
  }

  deleteRouteDays(id : Number){
    return this._http.delete(this.url+'routedays/'+ id);
  }

  updateRouteDays(id:Number, data:any): Observable<RouteDays>{
    return this._http.patch<RouteDays>(this.url+'routedays/'+id, data);
  }

  addRouteDetails(data : any){
    return this._http.post(this.url +'routedetails', data);
  }

  getRouteDetails(): Observable<RouteDetails[]>{
    return this._http.get<RouteDetails[]>(this.url +'routedetails');
  }

  getPaginatedRouteDetails( search:String, page: number, pageSize: number): Observable<RouteDetails[]>{
    return this._http.get<RouteDetails[]>(this.url + `routedetails?search=${search}&page=${page}&pageSize=${pageSize}`);
  }

  deleteRouteDetails(id : Number){
    return this._http.delete(this.url+'routedetails/'+ id);
  }

  updateRouteDetails(id:Number, data:any): Observable<RouteDetails>{
    return this._http.patch<RouteDetails>(this.url+'routedetails/'+id, data);
  }

  getRouteDetailsByRouteId(id: number): Observable<RouteDetails[]>{
    return this._http.get<RouteDetails[]>(this.url +'routedetails/byrouteid/'+ id);
  }

  getRouteDetailsById(id: number): Observable<RouteDetails>{
    return this._http.get<RouteDetails>(this.url +'routedetails/'+ id);
  }

  updateRouteDetailStatus(id:number, data:any){
    return this._http.patch<RouteDetails>(this.url+'routedetails/statusupdate/' + id, data);
  }

  addTrip(data : any){
    return this._http.post(this.url +'trip', data);
  }

  getTrip(): Observable<Trip[]>{
    return this._http.get<Trip[]>(this.url +'trip');
  }

  getPaginatedTrip( search:String, page: number, pageSize: number): Observable<Trip[]>{
    return this._http.get<Trip[]>(this.url + `trip?search=${search}&page=${page}&pageSize=${pageSize}`);
  }

  getTripById(id: number): Observable<Trip>{
    return this._http.get<Trip>(this.url +'trip/'+id);
  }

  getTripByRouteId(id: number): Observable<Trip[]>{
    return this._http.get<Trip[]>(this.url +'trip/byrouteid/'+id);
  }

  deleteTrip(id : Number){
    return this._http.delete(this.url+'trip/'+ id);
  }

  updateTrip(id:Number, data:any): Observable<Trip>{
    return this._http.patch<Trip>(this.url+'trip/'+id, data);
  }

  addTripDays(data : any){
    return this._http.post(this.url +'tripdays', data);
  }

  getTripDays(): Observable<TripDays[]>{
    return this._http.get<TripDays[]>(this.url +'tripdays');
  }

  getPaginatedTripDays( search:String, page: number, pageSize: number): Observable<RouteDays[]>{
    return this._http.get<TripDays[]>(this.url + `tripdays?search=${search}&page=${page}&pageSize=${pageSize}`);
  }

  getTripDayById(id: number): Observable<TripDays>{
    return this._http.get<TripDays>(this.url +'tripdays/'+id);
  }

  getTripDayByRouteId(id: number): Observable<TripDays[]>{
    return this._http.get<TripDays[]>(this.url +'tripdays/byrouteid/'+id);
  }

  deleteTripDays(id : Number){
    return this._http.delete(this.url+'tripdays/'+ id);
  }

  updateTripDays(id:Number, data:any): Observable<TripDays>{
    return this._http.patch<TripDays>(this.url+'tripdays/'+id, data);
  }

  addPickList(data : any){
    return this._http.post(this.url +'picklist', data);
  }

  getPickList(): Observable<PickList[]>{
    return this._http.get<PickList[]>(this.url +'picklist');
  }

  getPaginatedPickList( search:String, page: number, pageSize: number): Observable<PickList[]>{
    return this._http.get<PickList[]>(this.url + `picklist?search=${search}&page=${page}&pageSize=${pageSize}`);
  }

  getPickListById(id: number): Observable<PickList>{
    return this._http.get<PickList>(this.url +'picklist/'+id);
  }

  getPickListByRouteId(id: number): Observable<PickList[]>{
    return this._http.get<PickList[]>(this.url +'picklist/byrouteid/'+id);
  }

  deletePickList(id : Number){
    return this._http.delete(this.url+'picklist/'+ id);
  }

  updatePickList(id:Number, data:any): Observable<PickList>{
    return this._http.patch<PickList>(this.url+'picklist/'+id, data);
  }

  getPickListDetailsByProductId(id: number){
    return this._http.get<PickListDetails[]>(this.url+'picklistdetails/product/'+id);
  }

  getPickListDetails(id: number){

  }

}
