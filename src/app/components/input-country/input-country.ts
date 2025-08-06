import { Component, inject, Input } from '@angular/core';
import { ControlContainer, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CountryService } from '../../services/country.service';

interface AutoCompleteCompleteEvent {
    originalEvent: Event;
    query: string;
}

@Component({
  selector: 'app-input-country',
  imports: [CommonModule, ReactiveFormsModule, AutoCompleteModule],
  templateUrl: './input-country.html',
  styleUrl: './input-country.css',
  viewProviders: [
    { 
      provide: ControlContainer, 
      useFactory: () => inject(ControlContainer, {skipSelf: true})
    }
  ],
})
export class InputCountry {
  @Input() formGroup!: FormGroup;
  @Input() required!: boolean;
  @Input() controlName!: string;

  private countryService = inject(CountryService)
  countriesList!: Country[];
  selectedCountryAdvanced!: Country;
  filteredCountries!: Country[];

  ngOnInit() {
    this.countryService.getCountries().subscribe((countries: Country[]) => {
      this.countriesList = countries;
      console.log(this.countriesList);
    });
  }

  get control(): FormControl {
    return this.formGroup.get(this.controlName) as FormControl;
  }

  filterCountry(event: AutoCompleteCompleteEvent) {
    const query = event.query.toLowerCase();
    const list = this.countriesList;

    this.filteredCountries = list.filter(
      country => country.name.toLowerCase().startsWith(query)
    );
  }

  get isInvalid(): string | null {
    const control = this.control;
    if (control?.invalid && (control.dirty || control.touched)) {
      if (control.hasError('required')) return 'Campo obrigatório';
      if (control.hasError('invalidCountry')) return 'País inválido';
    }
    return null;
  }
}
