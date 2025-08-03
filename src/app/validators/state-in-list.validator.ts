import { AbstractControl, ValidatorFn } from '@angular/forms';

export function stateInListValidator(validStates: State[]): ValidatorFn {
  return (control: AbstractControl) => {
    const value = control.value;

    const isValid = validStates.some(state => {
      if (typeof value === 'string') {
        return state.name.toLowerCase() === value.toLowerCase();
      }
      return value?.name?.toLowerCase() === state.name.toLowerCase();
    });

    return isValid ? null : { invalidState: true };
  };
}
