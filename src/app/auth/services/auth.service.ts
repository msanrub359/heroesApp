import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environments } from 'src/environments/environments';
import { User } from '../interfaces/user';
import { Observable, tap, catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl=environments.baseUrl;
  private user?:User;

  constructor(private http:HttpClient) { }

  get CurrentUser(): User |undefined{
    if (!this.user) return undefined;

    return structuredClone (this.user);
  }

  checkAuthentication():Observable<boolean> {
    if (!localStorage.getItem('token')) return of (false);

    const token=localStorage.getItem('token');

    return this.http.get<User>(`${this.baseUrl}/users/1`)
    .pipe(
      tap ( user=>this.user=user),
      map (user=> !!user),
      catchError(err=> of (false))
    )
  }

  login( email:string, password:string):Observable<User>{
    return this.http.get<User>(`${this.baseUrl}/users/1`)
    .pipe(
      tap (user => this.user=user),
      tap (user=>localStorage.setItem('token', "jfkdjfdjfkdf.kjdfkjdfk.ljdkfjdk"))
    )
  }

  logout(){
    this.user=undefined;
    localStorage.clear();
  }

}
