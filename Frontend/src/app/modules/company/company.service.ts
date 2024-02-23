import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { company } from './models/company';
import { Team } from './models/team';
import { User } from '../users/models/user';
import { TeamMember } from './models/teamMembers';
import { Gst } from '../products/models/gst';


@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  url = environment.baseUrl;

  constructor(private _http:HttpClient) { }

  // STORE
  addCompany(data : any){
    return this._http.post(this.url+ "/company", data)
  }

  getTeams(): Observable<Team[]>{
    return this._http.get<Team[]>(this.url + '/team')
  }
  getGst(): Observable<Gst[]>{
    return this._http.get<Gst[]>(this.url + '/product/gst');
  }

  getCompanies(): Observable<company[]>{
    return this._http.get<company[]>(this.url+'/company');
  }
  addTeam(data: any) {
    return this._http.post(this.url + "/team", data);
  }
  // getTeams(): Observable<Team[]> {
  //   return this._http.get<Team[]>(this.url + "/team");
  // }
  addTeamMember(data: any) {
    return this._http.post(this.url + "/teamMember", data);
  }
  getTeamMembers(): Observable<TeamMember[]> {
    return this._http.get<TeamMember[]>(this.url + "/teamMember");
  }
  getTeamById(id: number): Observable<Team> {
    return this._http.get<Team>(this.url + "/team/" + id);
  }
  getTeamMembersByTeamId(id: number): Observable<TeamMember> {
    return this._http.get<TeamMember>(this.url + "/teamMember/teamMembersbyTeamId/" + id);
  }
  updateTeam(id: number, data: any): Observable<Team> {
    return this._http.patch<Team>(this.url + "/team/" + id, data);
  }

  deleteTeam(id: number) {
    return this._http.delete(this.url + "/team/" + id);
  }
  // getPaginatedStore( search:String, page: number, pageSize: number): Observable<Store[]>{
  //   return this._http.get<Store[]>(this.url + `?search=${search}&page=${page}&pageSize=${pageSize}`);
  // }

  updateCompany(id:Number, data:any){
    return this._http.patch<company>(this.url+'/company/' + id, data);
  }

  deleteCompany(id:Number){
    return this._http.delete(this.url+'/company/' +id);
  }

  // //WAREHOUSE
  // addWarehouse(data : any){
  //   return this._http.post(this.url + 'warehouse', data)
  // }

  // getWarehouse(): Observable<Warehouse[]>{
  //   return this._http.get<Warehouse[]>(this.url + 'warehouse');
  // }

  // getPaginatedWarehouse( search:String, page: number, pageSize: number): Observable<Warehouse[]>{
  //   return this._http.get<Warehouse[]>(this.url + `warehouse/?search=${search}&page=${page}&pageSize=${pageSize}`);
  // }

  // updatewarehouse(id:Number, data:any){
  //   return this._http.patch<Warehouse>(this.url + 'warehouse/' + id, data);
  // }

  // deletewarehouse(id:Number){
  //   return this._http.delete(this.url+ 'warehouse/'+ id);
  // }
}

