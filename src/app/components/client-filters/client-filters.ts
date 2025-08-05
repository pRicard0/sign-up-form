import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CountryService } from '../../services/country.service';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-client-filters',
  imports: [CommonModule, ReactiveFormsModule, SelectModule, ButtonModule ],
  templateUrl: './client-filters.html',
  styleUrl: './client-filters.css'
})
export class ClientFilters implements OnInit {
  @Output() filterChanged = new EventEmitter<{ country: Country | null; state: State | null }>();

  form: FormGroup;
  countriesList: Country[] = [];
  statesList: State[] = [];

  private fb = inject(FormBuilder);
  private countryService = inject(CountryService);

  constructor() {
    this.form = this.fb.group({
      country: [null],
      state: [{ value: null, disabled: true }]
    });
  }

  ngOnInit() {
    this.countryService.getCountries().subscribe(countries => {
      this.countriesList = countries;
    });

    this.form.get('country')?.valueChanges.subscribe((country: Country | null) => {
      this.statesList = country ? country.states : [];
      const stateControl = this.form.get('state');

      if (country) {
        stateControl?.enable();
      } else {
        stateControl?.reset();
        stateControl?.disable();
      }

      stateControl?.setValue(null);

      this.emitFilters();
    });

    this.form.get('state')?.valueChanges.subscribe(() => this.emitFilters());
  }

  private emitFilters() {
    this.filterChanged.emit({
      country: this.form.get('country')?.value,
      state: this.form.get('state')?.value
    });
  }

  clearFilters() {
    this.form.reset({
      country: null,
      state: { value: null, disabled: true }
    });
    this.emitFilters();
  }
}
