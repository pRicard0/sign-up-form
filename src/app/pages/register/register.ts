import { Component } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ConstructorsService } from '../../services/constructors.service';
import { SharedModule } from '../../services/shared/shared.modules';
import { CountryService } from '../../services/country.service';
import { stateInListValidator } from '../../validators/state-in-list.validator';
import { countryInListValidator } from '../../validators/country-in-list.validator';
import { toTitleCase } from '../../functions/toTitleCase';

@Component({
  selector: 'app-register',
  imports: [SharedModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
  providers: [CountryService] 
})
export class Register {
  minTextCharSize = 3;
  maxTextCharSize = 120;
  registerForm!: FormGroup;
  states: State[] = [];
  countries: Country[] = [];

  constructor(
    private dep: ConstructorsService,
    private countryService: CountryService
  ) {}

  ngOnInit() {
    this.registerForm = this.dep.fb.group({
      name: ['', [Validators.required, Validators.minLength(this.minTextCharSize), Validators.maxLength(this.maxTextCharSize)]],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', [Validators.required]],
      date: ['', [Validators.required]],
      typeNumber: ['', [Validators.required]],
      number: ['', [Validators.required, Validators.minLength(10)]],
      country: ['', [Validators.required]],
      state: [{ value: '', disabled: true }, [Validators.required]]
    });

    this.countryService.getCountries().subscribe(countries => {
      this.countries = countries;

      const countryControl = this.registerForm.get('country');
      countryControl?.setValidators([
        Validators.required,
        countryInListValidator(this.countries)
      ]);
      countryControl?.updateValueAndValidity();
    });
  }

  onCountrySelected(country: Country) {
    const stateControl = this.registerForm.get('state');
    stateControl?.enable();
    stateControl?.reset();

    this.countryService.getStatesByCountryId(country.id).subscribe(states => {
      this.states = states;

      stateControl?.setValidators([
        Validators.required,
        stateInListValidator(this.states)
      ]);
      stateControl?.updateValueAndValidity();
    });
  }

  onRegister() {
    if (this.registerForm.valid) {
      const raw = this.registerForm.value;

      const formData = {
        ...raw,
        name: toTitleCase(raw.name),
        email: raw.email.toLowerCase(),
        country: toTitleCase(typeof raw.country === 'object' ? raw.country.name : raw.country),
        state: toTitleCase(typeof raw.state === 'object' ? raw.state.name : raw.state)
      };

      console.log('Form submitted:', formData);
    } else {
      console.log('Form is invalid', this.registerForm);
    }
  }
}