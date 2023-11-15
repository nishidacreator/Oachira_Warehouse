import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const myToken = localStorage.getItem("JWT_TOKEN");
    if(myToken){
      request = request.clone({
        setHeaders: {Authorization: `Bearer ${myToken}`}
      })
    }
    return next.handle(request)
    .pipe(
      catchError((err: any)=>{
        if(err instanceof HttpErrorResponse){
          if(err.status === 403){
            alert('Token is expired, Please login again...')
            this.router.navigate([''])
          }
        }
        return throwError(()=>{
          alert(err.error.message)
        })
      })
   );
  }
}
