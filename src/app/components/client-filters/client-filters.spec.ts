import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientFilters } from './client-filters';
import { CountryService } from '../../services/country.service';
import { of } from 'rxjs';
import { SharedModule } from '../../services/shared/shared.modules';

describe('ClientFilters', () => {
  let component: ClientFilters;
  let fixture: ComponentFixture<ClientFilters>;

  const mockCountries = [
    {
      id: 1,
      name: 'Brasil',
      states: [
        { id: 11, name: 'São Paulo' },
        { id: 12, name: 'Rio de Janeiro' }
      ]
    },
    {
      id: 2,
      name: 'Argentina',
      states: [
        { id: 21, name: 'Buenos Aires' },
        { id: 22, name: 'Córdoba' }
      ]
    }
  ];

  const mockCountryService = {
    getCountries: () => of(mockCountries),
    getStatesByCountryId: (id: number) =>
      of(mockCountries.find(c => c.id === id)?.states || [])
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule],
      providers: [
        { provide: CountryService, useValue: mockCountryService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ClientFilters);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load countries on init', () => {
    expect(component.countriesList.length).toBe(2);
    expect(component.countriesList[0].name).toBe('Brasil');
  });

  it('should populate states when country is selected', () => {
    const brasil = mockCountries[0];
    component.form.get('country')?.setValue(brasil);
    expect(component.statesList).toEqual(brasil.states);
  });

  it('should emit filterChanged when country is selected', () => {
    const spy = spyOn(component.filterChanged, 'emit');
    const brasil = mockCountries[0];

    component.form.get('country')?.setValue(brasil);

    expect(spy).toHaveBeenCalledWith({
      country: brasil,
      state: null
    });
  });

  it('should emit filterChanged when state is selected', () => {
    const spy = spyOn(component.filterChanged, 'emit');
    const brasil = mockCountries[0];
    const sp = brasil.states[0];

    component.form.get('country')?.setValue(brasil);
    component.form.get('state')?.setValue(sp);

    expect(spy).toHaveBeenCalledWith({
      country: brasil,
      state: sp
    });
  });

  it('should clear filters and emit null values', () => {
    const spy = spyOn(component.filterChanged, 'emit');
    component.form.get('country')?.setValue(mockCountries[0]);
    component.form.get('state')?.setValue(mockCountries[0].states[0]);

    component.clearFilters();

    expect(component.form.get('country')?.value).toBeNull();
    expect(component.form.get('state')?.value).toBeNull();
    expect(spy).toHaveBeenCalledWith({
      country: null,
      state: null
    });
  });
});
