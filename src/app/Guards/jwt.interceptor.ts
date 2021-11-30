import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { AuthService } from '../Services/auth.service';

import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { User } from '../_model/user';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    i: number = 0;
    nullUser={
        firstName: '',
        id: '',
        jwtToken: '',
        lastName: '',
        role: '',
        tt: '',
        username: ''
    }

  constructor(private authenticationService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<any>> {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || '{}');
        if (currentUser && currentUser.jwtToken) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${currentUser.jwtToken}`,
                    'Access-Control-Max-Age': '3600'
                },
            });
            console.log(request)
        } else
          this.authenticationService.removeUser(this.nullUser);
        return next.handle(request).pipe(tap(
            () => { },
            (error: any) => {
                if (error instanceof HttpErrorResponse) {
                    if (error.status === 401) {
                        if(error.url == "http://localhost:3000/accounts/refresh-token") {
                            this.router.navigateByUrl("home");
                        } else {
                            this.i++;
                            if(this.i<=2) {
                                this.authenticationService.refreshToken({ refresh: currentUser.refresh, status: error.status }).subscribe(
                                    res => {
                                    }, err => {
                                        localStorage.removeItem("currentUser");
                                        this.router.navigateByUrl("home");
                                    });
                            } else {
                                this.router.navigateByUrl("");
                            }
                        }
                    } else if(error.status === 400 && error.url == "http://localhost:3000/accounts/refresh-token") {
                        this.i = 2;
                        this.router.navigateByUrl("home");
                    }
                }  else {
                    return error;
                }
            }));
  }
      
}
