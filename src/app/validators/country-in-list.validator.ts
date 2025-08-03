import { AbstractControl, ValidatorFn } from '@angular/forms';

export function countryInListValidator(validCountries: Country[]): ValidatorFn {
  return (control: AbstractControl) => {
    const value = control.value;

    const isValid = validCountries.some(country => {
      if (typeof value === 'string') {
        return country.name.toLowerCase() === value.toLowerCase();
      }
      return value?.name?.toLowerCase() === country.name.toLowerCase();
    });

    return isValid ? null : { invalidCountry: true };
  };
}