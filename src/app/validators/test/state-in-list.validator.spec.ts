import { FormControl } from '@angular/forms';
import { stateInListValidator } from '../state-in-list.validator';

describe('stateInListValidator', () => {
  const validStates: State[] = [
    { id: 1, name: 'São Paulo' },
    { id: 2, name: 'Rio de Janeiro' },
    { id: 3, name: 'Minas Gerais' }
  ];

  const validatorFn = stateInListValidator(validStates);

  it('should return null for valid state string (case insensitive)', () => {
    const control = new FormControl('rio de janeiro');
    const result = validatorFn(control);
    expect(result).toBeNull();
  });

  it('should return null for valid state object with name (case insensitive)', () => {
    const control = new FormControl({ name: 'são paulo' });
    const result = validatorFn(control);
    expect(result).toBeNull();
  });

  it('should return error object for invalid state string', () => {
    const control = new FormControl('Bahia');
    const result = validatorFn(control);
    expect(result).toEqual({ invalidState: true });
  });

  it('should return error object for invalid state object', () => {
    const control = new FormControl({ name: 'Bahia' });
    const result = validatorFn(control);
    expect(result).toEqual({ invalidState: true });
  });

  it('should return error object when control value is null or undefined', () => {
    const controlNull = new FormControl(null);
    const controlUndefined = new FormControl(undefined);

    expect(validatorFn(controlNull)).toEqual({ invalidState: true });
    expect(validatorFn(controlUndefined)).toEqual({ invalidState: true });
  });
});
