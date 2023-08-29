import { Injectable } from '@angular/core';
import { Country, Region, SmallCountry } from '../interfaces/Country.interfaces';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, tap } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  private _regions: Region[] = [Region.Africa, Region.America, Region.Asia, Region.Europe, Region.Oceania];

  private baseUrl: string = `https://restcountries.com/v3.1`;

  constructor(
    private http: HttpClient
  ) { }


  get regions() {
    return [...this._regions];
  }

  getCountriesByRegion(region: Region): Observable<SmallCountry[]> {

    if (!region) return of([]);
    const url=`${this.baseUrl}/region/${region}?fields=cca3,name,borders`;

    return this.http.get<Country[]>(url)
      .pipe(
        map(countries=>countries.map(country=>({
          name:    country.name.common,
          cca3:    country.cca3,
          borders: country.borders ?? []
        }))),
        tap(response =>
           console.log({response})
        )
      )

  }

}
