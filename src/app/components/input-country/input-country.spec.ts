import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputCountry } from './input-country';
import { CountryService } from '../../services/country.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { of } from 'rxjs';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { SharedModule } from '../../services/shared/shared.modules';
import { provideHttpClient } from '@angular/common/http';

describe('InputCountry', () => {
  let component: InputCountry;
  let fixture: ComponentFixture<InputCountry>;
  let mockCountryService: jasmine.SpyObj<CountryService>;

  const mockCountries = [
    { id: 1, name: 'Brasil', states: [] },
    { id: 2, name: 'Argentina', states: [] },
    { id: 3, name: 'Chile', states: [] }
  ];

  beforeEach(async () => {
    mockCountryService = jasmine.createSpyObj<CountryService>('CountryService', ['getCountries']);
    mockCountryService.getCountries.and.returnValue(of(mockCountries));

    await TestBed.configureTestingModule({
      imports: [SharedModule],
      providers: [
        provideHttpClient(),
        { provide: CountryService, useValue: mockCountryService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InputCountry);
    component = fixture.componentInstance;

    component.formGroup = new FormGroup({
      country: new FormControl(null, Validators.required)
    });
    component.controlName = 'country';
    component.required = true;

    fixture.detectChanges();

    component.ngOnInit();
    mockCountryService = TestBed.inject(CountryService) as jasmine.SpyObj<CountryService>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call CountryService.getCountries() on init', () => {
    expect(mockCountryService.getCountries).toHaveBeenCalled();
    expect(component.countriesList.length).toBe(3);
  });

  it('should filter countries based on input query', () => {
    component.countriesList = mockCountries;
    component.filterCountry({ query: 'Br', originalEvent: new Event('input') });

    expect(component.filteredCountries.length).toBe(1);
    expect(component.filteredCountries[0].name).toBe('Brasil');
  });

  it('should show required error message if control is touched and empty', () => {
    const control = component.control;
    control.markAsTouched();
    control.markAsDirty();
    control.setValue(null);

    fixture.detectChanges();

    const errorEl: DebugElement = fixture.debugElement.query(By.css('.error-message small'));
    expect(component.isInvalid).toBe('Campo obrigatório');
    expect(errorEl.nativeElement.textContent).toContain('Campo obrigatório');
  });

  it('should not show error if control is valid', () => {
    const control = component.control;
    control.setValue(mockCountries[0]);

    fixture.detectChanges();

    expect(component.isInvalid).toBeNull();
    const errorEl = fixture.debugElement.query(By.css('.error-message small'));
    expect(errorEl).toBeNull();
  });
  


  it('should return "País inválido" if control has invalidCountry error', () => {
    const control = component.control;

    control.setErrors({ invalidCountry: true });
    control.markAsTouched();
    control.markAsDirty();

    fixture.detectChanges();

    expect(component.isInvalid).toBe('País inválido');

    const errorEl: DebugElement = fixture.debugElement.query(By.css('.error-message small'));
    expect(errorEl.nativeElement.textContent).toContain('País inválido');
  });
});
