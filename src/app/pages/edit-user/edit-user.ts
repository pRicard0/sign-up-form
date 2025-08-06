import { Component, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SharedModule } from '../../services/shared/shared.modules';
import { CountryService } from '../../services/country.service';
import { CreateEdit } from '../../services/create-edit';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../interfaces/user';
import { emailExistsValidator } from '../../validators/email-exists.validator';

@Component({
  selector: 'app-edit-user',
  imports: [SharedModule],
  templateUrl: './edit-user.html',
  styleUrl: './edit-user.css',
  providers: [CountryService]
})
export class EditUser extends CreateEdit {
  private route = inject(ActivatedRoute);
  userId!: string;

  email!: string | null;
  loggedEmail = localStorage.getItem('email')

  constructor() {
    super(inject(FormBuilder), inject(CountryService));
  }

  ngOnInit() {
    this.formValue = this.buildForm();

    this.countryService.getCountries().subscribe(countries => {
      this.setCountryValidator(countries);
      this.email = this.route.snapshot.paramMap.get('email');

      if (this.email) this.loadUserData(this.email);
    });
  }

  loadUserData(email: string) {
    this.authService.getUserDetails(email).subscribe(user => {
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
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Usuário atualizado com sucesso!'
        });
        this.router.navigate([this.URL.HOME_URL]);
      },
      error: (err) => {
        console.error(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao atualizar usuário.'
        });
      }
    });
  }
}
