import { Component, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ConstructorsService } from '../../services/constructors.service';
import { SharedModule } from '../../services/shared/shared.modules';
import { CountryService } from '../../services/country.service';
import { CreateEdit } from '../../services/create-edit';
import { TOASTMESSAGE } from '../../services/shared/strings';

@Component({
  selector: 'app-register',
  imports: [SharedModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
  providers: [CountryService] 
})
export class Register extends CreateEdit {
  isLogged!: string | null;

  constructor(private dep: ConstructorsService) {
    super(inject(FormBuilder), inject(CountryService))
  }

  ngOnInit() {
    this.formValue = this.buildForm(); 

    this.countryService.getCountries().subscribe(countries => {
      this.setCountryValidator(countries);
    });

    this.isLogged = localStorage.getItem('email')
  }

  override onSubmit(formattedData: any): void {
    this.authService.registerUser(formattedData).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: TOASTMESSAGE.CREATE_SUCCESS
        });

        if(this.isLogged) {
          this.router.navigate(['home'])
        } else {
          this.router.navigate(['login']);
        }
      },
      error: (err) => {
        console.error(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: TOASTMESSAGE.ERROR
        });
      }
    });
  }
}