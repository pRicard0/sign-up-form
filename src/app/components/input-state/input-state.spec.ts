import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputState } from './input-state';
import { provideHttpClient } from '@angular/common/http';
import { CountryService } from '../../services/country.service';
import { of } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';

describe('InputState', () => {
  let component: InputState;
  let fixture: ComponentFixture<InputState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputState],
      providers: [
        provideHttpClient(),
        {
          provide: CountryService,
          useValue: {
            getStatesByCountryId: () => of([{ name: 'São Paulo' }, { name: 'Rio de Janeiro' }])
          }
        }
    ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputState);
    component = fixture.componentInstance;

    component.formGroup = new FormGroup({
      state: new FormControl('', Validators.required),
      country: new FormControl({ id: 1, name: 'Brasil' })
    });
    component.controlName = 'state';
    component.required = true;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show "Campo obrigatório" error when state is empty and touched', () => {
    const control = component.control;
    control.markAsTouched();
    control.setValue('');
    fixture.detectChanges();

    expect(component.isInvalid).toBe('Campo obrigatório');
  }); 

  it('should show "Estado inválido" error when control has invalidState error', () => {
    const control = component.control;
    control.setErrors({ invalidState: true });
    control.markAsTouched();
    fixture.detectChanges();

    expect(component.isInvalid).toBe('Estado inválido');
  });

  it('should filter states based on input query', () => {
    component.states = [
      { name: 'São Paulo', id: 1 },
      { name: 'Rio de Janeiro', id: 2 },
      { name: 'Minas Gerais', id: 3 }
    ];

    component.filterState({ query: 'r' } as any);
    fixture.detectChanges();

    expect(component.filteredStates).toEqual([{ name: 'Rio de Janeiro', id: 2 }]);
  });

  it('should load states when country changes', () => {
    const countryControl = component.formGroup.get('country');
    countryControl?.setValue({ id: 123, name: 'Brasil' });

    fixture.detectChanges();

    expect(component.states.length).toBeGreaterThan(0);
  });

  it('should have a valid FormControl for state', () => {
    expect(component.control).toBeTruthy();
    expect(component.control instanceof FormControl).toBeTrue();
  });

  it('should set states to empty when country is null', () => {
    const countryControl = component.formGroup.get('country');
    countryControl?.setValue(null);
    fixture.detectChanges();

    expect(component.states).toEqual([]);
  });

});