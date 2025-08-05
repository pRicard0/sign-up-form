import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export function emailExistsValidator(authService: AuthService, originalEmail?: string): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const email = control.value;

    if (!email || email === originalEmail) {
      return of(null); 
    }

    return authService.getUserByEmail(email).pipe(
      map(user => user ? { emailExists: true } : null),
      catchError(() => of(null))
    );
  };
}
