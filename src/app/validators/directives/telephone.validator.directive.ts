import { Directive, Input, OnInit } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[appTelephoneTypeValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: TelephoneTypeValidatorDirective,
      multi: true
    }
  ]
})
export class TelephoneTypeValidatorDirective implements Validator {
  @Input('appTelephoneTypeValidator') typeControlName!: string;

  private typeControl!: AbstractControl | null;

  validate(control: AbstractControl): ValidationErrors | null {
    if (!control.parent) return null;

    this.typeControl = control.parent.get(this.typeControlName);
    if (!this.typeControl) return null;

    const type = this.typeControl.value?.name || this.typeControl.value;
    const rawValue = (control.value || '').replace(/\D/g, '');

    if (!type || !rawValue) return null;

    const isCelular = rawValue.length === 11 && rawValue[2] === '9';
    const isResidencial = rawValue.length === 10;
    
    if (rawValue.length < 10) {
        return { minlength: true };
    } else if (rawValue.length === 11 && !isCelular) {
        return { invalidType: true };
    }

    return null;
  }
}