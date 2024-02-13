import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject, Observable, tap, mapTo, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Role } from './models/role';
import { User } from './models/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  url = environment.baseUrl;

  private readonly token = 'token'
  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN'
  private loggedUser: any

  constructor(private _http:HttpClient) { }

  private  currentUserSource = new ReplaySubject<User | null>(1)
  currentUser$ = this.currentUserSource.asObservable();

  registerUser(data : any){
    return this._http.post(this.url + '/register', data)
  }

  getUser():Observable<User[]>{
    return this._http.get<User[]>(this.url + '/register')
  }

  getUserById(id: number):Observable<User>{
    return this._http.get<User>(this.url + '/register/'+id)
  }

  getPaginatedUser(search:string, page: number, pageSize: number): Observable<User[]>{
    return this._http.get<User[]>(this.url + '/register/' + `?search=${search}&page=${page}&pageSize=${pageSize}`);
  }

  updateUser(id:Number, data:any){
    return this._http.patch<User>(this.url+'/register/' + id, data);
  }

  deleteUser(id:Number){
    return this._http.delete(this.url+'/register/'+id);
  }

  login(data: any){
    return this._http.post(this.url + '/login', data)
    .pipe(
      tap((tokens) => this.doLoginUser(data.phoneNumber, tokens)),
      mapTo(true),
      catchError((error: any) => {
        return of(false)
      })
    )
  }

  private doLoginUser(userName: String, tokens: any){
    this.loggedUser = userName
    this.storeTokens(tokens)
  }

  private storeTokens(tokens: any){
    localStorage.setItem(this.JWT_TOKEN, tokens.token.accessToken)
    localStorage.setItem(this.REFRESH_TOKEN, tokens.token.refreshToken)
    localStorage.setItem('token', JSON.stringify(tokens))
  }

  getJwtToken(){
    return localStorage.getItem(this.JWT_TOKEN);
  }

  isLoggedIn(): boolean{
    let loggedStatus = this.getJwtToken()
    return !!this.getJwtToken();
  }

  logout(){
    // localStorage.clear()
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
    localStorage.removeItem("token");
    // return this._http.post(this.url + '/logout', {
    //   'refreshToken': this.getRefreshToken()
    // }).pipe(
    //   tap((tokens) => this.doLogoutUser()),
    //   mapTo(true),
    //   catchError((error: any) => {
    //     alert(error.error)
    //     return of(false)
    //   })
    // )

  }

//   private getRefreshToken(){}

//   private doLogoutUser(){
//     this.loggedUser = null;
//     this.removeTokens();
//   }

//   private removeTokens(){
//     localStorage.removeItem(this.JWT_TOKEN)
//     localStorage.removeItem(this.REFRESH_TOKEN)
//   }

//   refreshToken(){
//     return this._http.post<any>(this.url+'/refresh', {
//       'refreshToken': this.getRefreshToken()
//     }).pipe(tap((tokens : any)=>{
//       this.storeJwtTokens(tokens.accessToken)
//     }))
//   }

//   private storeJwtTokens(jwt : string){}

// ROLE............................................................
  addRole(data: any){
    return this._http.post<Role[]>(this.url + '/role', data)
  }

  getRole():Observable<Role[]>{
    return this._http.get<Role[]>(this.url + '/role')
  }

  getRoleById(id: number):Observable<Role>{
    return this._http.get<Role>(this.url + '/role/' + id)
  }

  getRoleByRole(data: any):Observable<Role>{
    const queryParams = new HttpParams().set('role', data.role);
    return this._http.get<Role>(this.url+'/role/rolename/', { params: queryParams });
  }

  deleteRole(id: number){
    return this._http.delete<Role[]>(this.url + '/role/' + id)
  }

  updateRole(data: any, id: number){
    return this._http.patch<Role[]>(this.url + '/role/' + id, data)
  }

  updateUserStatus(id:number, data:any){
    return this._http.patch<User>(this.url+'/register/statusupdate/' + id, data);
  }

  updateRoleStatus(id:number, data:any){
    return this._http.patch<Role>(this.url+'/role/statusupdate/' + id, data);
  }
}
