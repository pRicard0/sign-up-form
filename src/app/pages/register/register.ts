import { Component, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ConstructorsService } from '../../services/constructors.service';
import { SharedModule } from '../../services/shared/shared.modules';
import { CountryService } from '../../services/country.service';
import { CreateEdit } from '../../services/create-edit';
import { TOASTMESSAGE, URL } from '../../services/shared/strings';
import { Observable } from 'rxjs';
import { User } from '../../interfaces/user';
import { userDetailsSelector } from '../../store/user.selectors';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { userActions } from '../../store/user.actions';

@Component({
  selector: 'app-register',
  imports: [SharedModule, AsyncPipe],
  templateUrl: './register.html',
  styleUrl: './register.css',
  providers: [CountryService] 
})
export class Register extends CreateEdit {
  isLogged!: string | null;
  store = inject(Store)
  loggedUser$: Observable<User | null> = this.store.select(userDetailsSelector)

  constructor(private dep: ConstructorsService) {
    super(inject(FormBuilder), inject(CountryService))
  }

  ngOnInit() {
    this.formValue = this.buildForm(); 

    this.countryService.getCountries().subscribe(countries => {
      this.setCountryValidator(countries);
    });

    const email = localStorage.getItem('email');
    this.isLogged = email
    if (email) {
      this.store.dispatch(userActions.getUserDetails({ email }));
    }
  }

  override onSubmit(formattedData: any): void {
    this.authService.registerUser(formattedData).subscribe({
      next: () => {
        this.logService.info(TOASTMESSAGE.CREATE_SUCCESS, formattedData)
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: TOASTMESSAGE.CREATE_SUCCESS
        });

        if(this.isLogged) {
          this.router.navigate([URL.HOME_URL])
        } else {
          this.router.navigate([URL.LOGIN_URL]);
        }
      },
      error: (err) => {
        this.logService.error(TOASTMESSAGE.ERROR, err)
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: TOASTMESSAGE.ERROR
        });
      }
    });
  }
}