import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { environments } from 'src/environments/environments';
import { Hero } from '../interfaces/hero';

@Injectable({
  providedIn: 'root'
})
export class HeroesService {

  private baseUrl:string=environments.baseUrl;

  constructor(private http:HttpClient) { }

  getHeroes():Observable<Hero[]>{
    return this.http.get<Hero[]>(`${this.baseUrl}/heroes`)
  }

  getHeroById (id:string): Observable<Hero|undefined>{
    return this.http.get<Hero>(`${this.baseUrl}/heroes/${id}`)
    .pipe (
      catchError (error=> of (undefined))
    );
  }
  getSuggestions(query:string):Observable<Hero[]>{
    return this.http.get<Hero[]>(`${this.baseUrl}/heroes?q=${query}&_limit=6`);
  }

  addHero(hero:Hero):Observable<Hero>{
    return this.http.post<Hero>(`${this.baseUrl}/heroes`, hero);
  }
  updateHero(hero:Hero):Observable<Hero>{
    if (!hero.id) throw ("Heroes es requerido");

    return this.http.patch<Hero>(`${this.baseUrl}/heroes/${hero.id}`, hero);
  }
  deleteHero(id:string):Observable<boolean>{

    return this.http.delete(`${this.baseUrl}/heroes/${id}`)
    .pipe (
      catchError(err=> of (false)),
      map (resp=> true)
    );
  }
}
