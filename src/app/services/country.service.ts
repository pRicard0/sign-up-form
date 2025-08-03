import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CountryService {
    private baseUrl = 'http://localhost:3000';
    private countriesUrl = `${this.baseUrl}/countries`;

    constructor(private http: HttpClient) {}

    getCountries(): Observable<Country[]> {
        return this.http.get<Country[]>(this.countriesUrl);
    }

    getStatesByCountryId(id: number): Observable<State[]> {
        return this.http.get<Country[]>(`${this.countriesUrl}?id=${id}`)
            .pipe(map(countries => countries[0]?.states || []));
    }
};