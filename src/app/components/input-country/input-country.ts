import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ControlContainer, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AutoCompleteModule, AutoCompleteSelectEvent } from 'primeng/autocomplete';
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
  providers: [CountryService]
})
export class InputCountry {
  @Input() formGroup!: FormGroup;
  @Input() required!: boolean;
  @Input() controlName!: string;
  @Output() countrySelected = new EventEmitter<Country>();

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

  onCountrySelected(event: AutoCompleteSelectEvent) {
    const selectedCountry = event.value as Country;
    this.control.setValue(selectedCountry);
    this.countrySelected.emit(selectedCountry);
  }

  get isInvalid(): string | null {
    const control = this.control;
    if (control?.invalid && (control.dirty || control.touched)) {
      if (control.hasError('required')) {
        return 'Campo obrigatório';
      }
    }
    return null;
  }
}
