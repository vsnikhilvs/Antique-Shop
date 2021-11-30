import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../_model/user';

import { Account } from '../_model/account';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  private baseUrl = environment.baseUrl;

  private out = new BehaviorSubject(null);
  loggedout = this.out.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem("currentUser") || '{}')
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  authFailed(data: any) {
    this.out.next(data);
  }

  public login(email: string, password: string) {
    return this.http
      .post<any>(`${this.baseUrl}/accounts/authenticate`, { email, password })
      .pipe(
        map((user: any) => {
          // login successful if there's a token in the response
          if (user && user.jwtToken) {
            let date = new Date();
            user.tt = date;
            // store user details and token in local storage to keep user logged in between page refreshes
            console.log(user)
            localStorage.setItem("currentUser", JSON.stringify(user));
            this.currentUserSubject.next(user);
            this.authFailed(null);
          }
          return user;
        })
      );
  }

  logout() {
    // this.http.post<any>(`${this.baseUrl}/accounts/revoke-token`, {}).subscribe(
    //   (res) => {
    //     console.log(res);
    //   }, (err) => {
    //     console.log(err);
    //   }
    // );
    localStorage.removeItem("currentUser");
    this.removeUser({
      firstName: '',
        id: '',
        jwtToken: '',
        lastName: '',
        role: '',
        tt: '',
        username: ''
    })
    this.authFailed('out');
  }

  // register() {
  //   return this.http.post(`${this.baseUrl}/accounts/register`, {
  //     id: 101,
  //     title: 'Mr',
  //     firstName: 'Test',
  //     lastName: 'User',
  //     email: 'test@testmail.com',
  //     role: 'Admin',
  //     password: 'testtest',
  //     confirmPassword: 'testtest'
  //   }); 
  // }

  refreshToken(refreshToken:any) {
    return this.http
      .post<any>(`${this.baseUrl}/accounts/refresh-token`, refreshToken)
      .pipe(
        retry(refreshToken.status == 401 || refreshToken.status == 200 ? 1 : 3),
        map((user: any) => {
          if (user) {
            let date = new Date();
            const newAccess = { jwtToken: user.jwtToken, refresh: user.refresh, tt: date };
            localStorage.setItem("currentUser", JSON.stringify(newAccess));
            this.currentUserSubject.next(user);
          }
        })
      );
  }
  removeUser(user: User) {
    this.currentUserSubject.next(user);
  }
}
