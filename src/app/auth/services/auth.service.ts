import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environments } from '../../../environments/environments';
import { User } from '../interfaces/user.interface';
import { catchError, map, Observable, of, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthService {

  private baseUrl = environments.baseUrl;
  private user?: User;

  constructor(private httpClient: HttpClient) { }

  get currentUser(): User | undefined {
    if (!this.user){return undefined;}
    return structuredClone(this.user);
  }


  login(email: string, password: string): Observable<User> {
    return this.httpClient.get<User>(`${this.baseUrl}/users/1`)
      .pipe(
        tap(user => this.user = user),
        tap( user => localStorage.setItem('token', '3424234.fsdfsdfsdf.23423')),
      );

  }


  logout() {
    this.user = undefined;
    localStorage.clear();
  }

  checkAuthentication(): Observable<boolean> {
    const token = localStorage.getItem('token');

    if (!token) {
      return of(false);
    }

    return this.httpClient.get<User>(`${this.baseUrl}/users/1`)
      .pipe(
        tap(user => this.user = user),
        map( user => !!user),
        catchError(() => of(false)));

  }
}


