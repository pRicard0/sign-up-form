import { Component, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SharedModule } from '../../services/shared/shared.modules';
import { CountryService } from '../../services/country.service';
import { CreateEdit } from '../../services/create-edit';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../interfaces/user';
import { emailExistsValidator } from '../../validators/email-exists.validator';
import { TOASTMESSAGE } from '../../services/shared/strings';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { userDetailsSelector } from '../../store/user.selectors';
import { AsyncPipe } from '@angular/common';
import { userActions } from '../../store/user.actions';

@Component({
  selector: 'app-edit-user',
  imports: [SharedModule, AsyncPipe],
  templateUrl: './edit-user.html',
  styleUrl: './edit-user.css',
})
export class EditUser extends CreateEdit {
  route = inject(ActivatedRoute);
  store = inject(Store)
  userId!: string;

  email!: string | null;
  loggedEmail = localStorage.getItem('email')
  loggedUser$: Observable<User | null> = this.store.select(userDetailsSelector)

  constructor() {
    super(inject(FormBuilder), inject(CountryService));
  }

  ngOnInit() {
    this.formValue = this.buildForm();

    this.countryService.getCountries().subscribe(countries => {
      this.setCountryValidator(countries);

      this.route.paramMap.subscribe(paramMap => {
        this.email = paramMap.get('email');
        if (this.email) this.loadUserData(this.email);
      });
    });

    const email = localStorage.getItem('email');
    if (email) {
      this.store.dispatch(userActions.getUserDetails({ email }));
    }
  }

  loadUserData(email: string) {
    this.authService.getUserDetails(email).subscribe(user => {
      if (!user || user.length === 0) {
        this.logService.warn(TOASTMESSAGE.EDIT_NOTFOUND_WARN, `User: ${user}`)
          this.messageService.add({
            severity: 'warn',
            summary: 'Atenção',
            detail: TOASTMESSAGE.EDIT_NOTFOUND_WARN
        });
        this.router.navigate([this.URL.HOME_URL])

        return;
      }
      const birthDateString = user[0].birthDate;
      const birthDateObj = birthDateString ? new Date(birthDateString) : null;
      this.userId = user[0].id;

      this.formValue.patchValue({
        name: user[0].name,
        email: user[0].email,
        cpf: user[0].cpf,
        birthDate: birthDateObj,
        numberType: user[0].numberType,
        number: user[0].number,
        country: user[0].country,
        state: user[0].state
      });

      const emailControl = this.formValue.get('email');
      if (emailControl) {
        emailControl.setAsyncValidators(emailExistsValidator(this.authService, user[0].email));
        emailControl.updateValueAndValidity();
      }
      this.setCountryValidator(this.countries);
    });
  }

  override onSubmit(formattedData: User): void {
    const updatedUser = { ...formattedData, id: this.userId };

    if (this.loggedEmail == this.email && this.email !== null) {
      localStorage.setItem('email', formattedData.email)
    }

    this.authService.updateUser(updatedUser).subscribe({
      next: () => {
        this.logService.info(TOASTMESSAGE.EDIT_SUCCESS, updatedUser)
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: TOASTMESSAGE.EDIT_SUCCESS
        });
        this.router.navigate([this.URL.HOME_URL]);
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
