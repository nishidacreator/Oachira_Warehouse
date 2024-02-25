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
import { RouteDays } from './route/models/route-days';
import { Trip } from './route/models/trip';
import { RouteOrder } from './route/models/route-order';
import { RouteOrderDetails } from './route/models/route-order-details';
import { RouteEntry } from './route/models/route-entry';
import { CustomerLedger } from './route/models/customer-ledger';
import { DailyCollection } from './route/models/daily-collection';

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

  getLedgerByCustomer(id: number): Observable<CustomerLedger[]>{
    return this._http.get<CustomerLedger[]>(this.url+'ledger/cutomer/' + id);
  }

getLedger():Observable<CustomerLedger[]>{
  return this._http.get<CustomerLedger[]>(this.url+'ledger');
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

  addRouteOrder(data : any){
    return this._http.post(this.url +'routeorder', data);
  }

  getRouteOrder(): Observable<RouteOrder[]>{
    return this._http.get<RouteOrder[]>(this.url +'routeorder');
  }

  getPaginatedRouteOrder( search:String, page: number, pageSize: number): Observable<RouteOrder[]>{
    return this._http.get<RouteOrder[]>(this.url + `routeorder?search=${search}&page=${page}&pageSize=${pageSize}`);
  }

  getRouteOrderById(id: number): Observable<RouteOrder>{
    return this._http.get<RouteOrder>(this.url +'routeorder/'+id);
  }

  getRouteOrderByRouteId(id: number): Observable<RouteOrder[]>{
    return this._http.get<RouteOrder[]>(this.url +'routeorder/routeid/'+id);
  }

  deleteRouteOrder(id : Number){
    return this._http.delete(this.url+'routeorder/'+ id);
  }

  updateRouteOrder(id:Number, data:any): Observable<RouteOrder>{
    return this._http.patch<RouteOrder>(this.url+'routeorder/'+id, data);
  }

  getRouteOrderDetailsByProductId(id: number){
    return this._http.get<RouteOrderDetails[]>(this.url+'routeorderdetails/product/'+id);
  }

  getRouteOrderDetails(id: number){
    return this._http.get<RouteOrderDetails[]>(this.url +'routeorderdetails/routeid/'+id);
  }

  getRouteSoDetailsByProductId(id: number, routeId: number){
    return this._http.get<RouteOrderDetails[]>(this.url +'routeorderdetails/productid/'+id + '/' + routeId);
  }

  //SALES ENTRY
  addRouteEntry(data: any){
    return this._http.post(this.url +'routeentry', data);
  }

  getRouteEntry(){
    return this._http.get<RouteEntry[]>(this.url+'routeentry');
  }

  getRouteEntryById(id: number): Observable<RouteEntry>{
    return this._http.get<RouteEntry>(this.url+'routeentry/'+ id);
  }

  deleteRouteEntry(id : Number){
    return this._http.delete(this.url+'routeentry/'+ id);
  }

  updateRouteEntry(id:Number, data:any): Observable<RouteEntry>{
    return this._http.patch<RouteEntry>(this.url+'routeentry/'+id, data);
  }

  //-----------------Daily collection----------------------------------------------
  // addRouteEntry(data: any){
  //   return this._http.post(this.url +'routeentry', data);
  // }

  // getRouteEntry(){
  //   return this._http.get<RouteEntry[]>(this.url+'routeentry');
  // }

  addDailyCollection(data : any){
    return this._http.post(this.url +'dailyCollection',data)
  }

  getDailyCollection(){
    return this._http.get<DailyCollection[]>(this.url+'dailyCollection')
  }

  getDailyCollectionById(id:number):Observable<DailyCollection>{
    return this._http.get<DailyCollection>(this.url+ 'dailyCollection/' + id)
  }

  updateDailyCollection(id : number , data : any):Observable<DailyCollection>{
    return this._http.patch<DailyCollection>(this.url + 'dailyCollection/' + id , data)
  }

  deleteDailyCollection(id : number){
    return this._http.delete(this.url + 'dailyCollection/' + id)
  }

  //-------------Customer ledger
  getCustomerLedgerByCustomerId(id:number):Observable<CustomerLedger>{
   
      return this._http.get<CustomerLedger>(this.url+'ledger/cutomer/'+id);
    }


  
}
