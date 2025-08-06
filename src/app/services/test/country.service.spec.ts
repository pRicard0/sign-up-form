import { TestBed } from '@angular/core/testing';

import { CountryService } from '../country.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('CountryService', () => {
  let service: CountryService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(CountryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch countries', () => {
    const mockCountries: Country[] = [
      { id: 1, name: 'Brasil', states: [] },
      { id: 2, name: 'Argentina', states: [] }
    ];

    service.getCountries().subscribe(countries => {
      expect(countries.length).toBe(2);
      expect(countries).toEqual(mockCountries);
    });

    const req = httpMock.expectOne('http://localhost:3000/countries');
    expect(req.request.method).toBe('GET');
    req.flush(mockCountries);
  });

  it('should fetch states by country ID', () => {
    const mockStates: State[] = [
      { id: 1, name: 'SP' },
      { id: 2, name: 'RJ' }
    ];

    const mockCountry: Country = {
      id: 1,
      name: 'Brasil',
      states: mockStates
    };

    service.getStatesByCountryId(1).subscribe(states => {
      expect(states.length).toBe(2);
      expect(states).toEqual(mockStates);
    });

    const req = httpMock.expectOne('http://localhost:3000/countries?id=1');
    expect(req.request.method).toBe('GET');
    req.flush([mockCountry]);
  });

  it('should return empty array if no country found with given ID', () => {
    service.getStatesByCountryId(999).subscribe(states => {
      expect(states).toEqual([]);
    });

    const req = httpMock.expectOne('http://localhost:3000/countries?id=999');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });
});
