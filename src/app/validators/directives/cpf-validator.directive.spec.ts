import { FormControl } from '@angular/forms';
import { CpfValidatorDirective } from './cpf.validator.directive';

describe('CpfValidatorDirective', () => {
  let directive: CpfValidatorDirective;

  beforeEach(() => {
    directive = new CpfValidatorDirective();
  });

  it('should return null for valid CPF', () => {
    const control = new FormControl('12345678909');
    const result = directive.validate(control);
    expect(result).toBeNull();
  });

  it('should return error object for invalid CPF', () => {
    const control = new FormControl('12345678900'); 
    const result = directive.validate(control);
    expect(result).toEqual({ invalidCPF: true });
  });

  it('should return null if CPF is empty', () => {
    const control = new FormControl('');
    const result = directive.validate(control);
    expect(result).toBeNull();
  });

  it('should return error if CPF is malformed', () => {
    const control = new FormControl('abc123');
    const result = directive.validate(control);
    expect(result).toEqual({ invalidCPF: true });
  });
});
