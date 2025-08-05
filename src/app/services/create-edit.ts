import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { countryInListValidator } from '../validators/country-in-list.validator';
import { stateInListValidator } from '../validators/state-in-list.validator';
import { toTitleCase } from '../functions/toTitleCase';
import { CountryService } from './country.service';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { URL } from './shared/strings';
import { emailExistsValidator } from '../validators/email-exists.validator';

export abstract class CreateEdit {
  protected minTextCharSize = 3;
  protected maxTextCharSize = 120;
  protected fb: FormBuilder;
  protected countryService: CountryService;
  protected countries: Country[] = [];
  protected states: State[] = [];

  public formValue!: FormGroup;
  public messageService = inject(MessageService)
  public router = inject(Router)
  public authService = inject(AuthService)

  public URL = URL

  constructor(fb: FormBuilder, countryService: CountryService) {
    this.fb = fb;
    this.countryService = countryService;
  }

  buildForm(originalEmail?: string): FormGroup {
    this.formValue = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(this.minTextCharSize), Validators.maxLength(this.maxTextCharSize)]],
      email: ['', [Validators.required, Validators.email], emailExistsValidator(this.authService, originalEmail)],
      cpf: ['', []],
      birthDate: ['', [Validators.required]],
      numberType: ['', [Validators.required]],
      number: ['', [Validators.required, Validators.minLength(10)]],
      country: ['', [Validators.required]],
      state: [{ value: '', disabled: true }, [Validators.required]]
    });

    this.setupCountryChangeReactivity();
    return this.formValue;
  }

  setCountryValidator(countries: Country[]): void {
    this.countries = countries;

    const countryControl = this.formValue.get('country');
    if (countryControl) {
      countryControl.setValidators([
        Validators.required,
        countryInListValidator(this.countries)
      ]);
      countryControl.updateValueAndValidity();
    }
  }

  private setupCountryChangeReactivity(): void {
    const countryControl = this.formValue.get('country');
    const cpfControl = this.formValue.get('cpf');
    const stateControl = this.formValue.get('state');

    countryControl?.valueChanges.subscribe(value => {
      const countryName = typeof value === 'object' ? value.name : value;
      const matchedCountry = this.countries.find(c => c.name.toLowerCase() === countryName?.toLowerCase());

      const isBrazil = matchedCountry?.name.toLowerCase() === 'brasil';

      if (isBrazil) {
        cpfControl?.addValidators(Validators.required);
      } else {
        const currentValidators = cpfControl?.validator ? [cpfControl.validator] : [];
        const filteredValidators = currentValidators.filter(
          v => v !== Validators.required
        );
        cpfControl?.setValidators(filteredValidators);
      }

      cpfControl?.updateValueAndValidity();

      if (matchedCountry) {
        this.countryService.getStatesByCountryId(matchedCountry.id).subscribe(states => {
          this.states = states;

          stateControl?.enable();
          stateControl?.setValidators([
            Validators.required,
            stateInListValidator(this.states)
          ]);
          stateControl?.updateValueAndValidity();
        });
      } else {
        stateControl?.reset();
        stateControl?.disable();
        stateControl?.clearValidators();
        stateControl?.updateValueAndValidity();
      }
    });
  }

  submit() {
    if (this.formValue.valid) {
      const formatted = this.getFormattedFormData();
      this.onSubmit(formatted);
    } else {
      console.warn('Form inválido:', this.formValue);
    }
  }

  protected getFormattedFormData(): any {
    const raw = this.formValue.value;

    return {
      ...raw,
      name: toTitleCase(raw.name),
      email: raw.email.toLowerCase(),
      country: toTitleCase(typeof raw.country === 'object' ? raw.country.name : raw.country),
      state: toTitleCase(typeof raw.state === 'object' ? raw.state.name : raw.state)
    };
  }

  protected abstract onSubmit(formattedData: any): void;
}