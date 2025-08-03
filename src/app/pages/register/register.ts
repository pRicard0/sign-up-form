import { Component, inject } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ConstructorsService } from '../../services/constructors.service';
import { SharedModule } from '../../services/shared/shared.modules';
import { CountryService } from '../../services/country.service';
import { stateInListValidator } from '../../validators/state-in-list.validator';
import { countryInListValidator } from '../../validators/country-in-list.validator';
import { toTitleCase } from '../../functions/toTitleCase';
import { AuthService } from '../../services/auth.service';
import { RegisterPostData } from '../../interfaces/registerPostData';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

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

  private authService = inject(AuthService)
  private messageService = inject(MessageService)
  private router = inject(Router)

  constructor(
    private dep: ConstructorsService,
    private countryService: CountryService,
  ) {}

  ngOnInit() {
    this.registerForm = this.dep.fb.group({
      name: ['', [Validators.required, Validators.minLength(this.minTextCharSize), Validators.maxLength(this.maxTextCharSize)]],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', []],
      birthDate: ['', [Validators.required]],
      numberType: ['', [Validators.required]],
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


    const cpfControl = this.registerForm.get('cpf');
    const stateControl = this.registerForm.get('state');
    this.registerForm.get('country')?.valueChanges.subscribe(value => {

      const countryName = typeof value === 'object' ? value.name : value;
      const matchedCountry = this.countries.find(c => c.name.toLowerCase() === countryName?.toLowerCase());

      const isBrazil = matchedCountry?.name.toLowerCase() === 'brasil';

      if (isBrazil) {
        cpfControl?.setValidators([Validators.required]);
      } else {
        cpfControl?.clearValidators();
        cpfControl?.setValue('');
      }
      cpfControl?.updateValueAndValidity();

      stateControl?.reset();
      stateControl?.disable();
      stateControl?.clearValidators();
      stateControl?.updateValueAndValidity();

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
      }
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

      this.authService.registerUser(formData as RegisterPostData).subscribe(
        {
          next: (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Conta criada com sucesso!'
            })
            console.log(response)
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Parece que deu algum erro. Tente novamente mais tarde.'
            })
            this.router.navigate(['login'])
            console.log(err)
          }
        }
      )
    } else {
      console.log('Form is invalid', this.registerForm);
    }
  }
}