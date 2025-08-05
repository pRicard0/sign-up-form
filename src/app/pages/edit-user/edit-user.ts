import { Component, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SharedModule } from '../../services/shared/shared.modules';
import { ConstructorsService } from '../../services/constructors.service';
import { CountryService } from '../../services/country.service';
import { CreateEdit } from '../../services/create-edit';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-user',
  imports: [SharedModule],
  templateUrl: './edit-user.html',
  styleUrl: './edit-user.css',
  providers: [CountryService]
})
export class EditUser extends CreateEdit {
  private userService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private userId!: string;

  constructor(private dep: ConstructorsService) {
    super(inject(FormBuilder), inject(CountryService));
  }

  ngOnInit() {
    this.formValue = this.buildForm();

    this.countryService.getCountries().subscribe(countries => {
      this.setCountryValidator(countries);
    
      const email = this.route.snapshot.paramMap.get('email');
      if (email) {
        this.loadUserData(email);
      }
    });
  }

  loadUserData(email: string) {
    this.userService.getUserDetails(email).subscribe(user => {
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

      this.setCountryValidator(this.countries);
    });
  }

  protected override onSubmit(formattedData: any): void {
    const updatedUser = { ...formattedData, id: this.userId };

    this.userService.updateUser(updatedUser).subscribe({
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
