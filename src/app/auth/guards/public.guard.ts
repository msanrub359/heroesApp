import {  CanMatch, CanActivate, Route, UrlSegment, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';


import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';


@Injectable({providedIn: 'root'})

export class publicGuard implements CanMatch, CanActivate {
  constructor(private authService:AuthService,
    private router: Router) { }

  private checkAuthStatus():boolean |Observable<boolean>{
    return this.authService.checkAuthentication()
    .pipe(
      tap (isAuthenticated=>{
        if (!isAuthenticated){
          this.router.navigate(['./'])
        }
      }),
      map(isAuthenticated=>!isAuthenticated)
    )
  }

  canMatch(route: Route, segments: UrlSegment[]): boolean |Observable<boolean> {
    console.log('Can Match');
    console.log({route, segments});
    return this.checkAuthStatus();
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {

    console.log('Can Match');
    console.log({route, state});

    return this.checkAuthStatus();
  }

}
