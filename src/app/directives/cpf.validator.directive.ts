import { Directive } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[appCpfValidator]',
  standalone: true,
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: CpfValidatorDirective,
      multi: true
    }
  ]
})
export class CpfValidatorDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    const cpf = control.value;
    if (!cpf) return null;

    const valid = this.validarCPF(cpf);
    return valid ? null : { invalidCPF: true };
  }

  private validarCPF(cpf: string): boolean {
    if (!cpf) return false;

    const cleanedCpf = cpf.replace(/[^\d]+/g, '');

    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cleanedCpf.charAt(i)) * (10 - i);
    }
    let firstDigit = 11 - (sum % 11);
    if (firstDigit >= 10) firstDigit = 0;
    if (firstDigit !== parseInt(cleanedCpf.charAt(9))) {
        return false;
    }

    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cleanedCpf.charAt(i)) * (11 - i);
    }
    let secondDigit = 11 - (sum % 11);
    if (secondDigit >= 10) secondDigit = 0;
    if (secondDigit !== parseInt(cleanedCpf.charAt(10))) {
        return false;
    }

    return true;
  }
}