import { ComponentFixture, TestBed, fakeAsync, waitForAsync } from '@angular/core/testing';
import { InputEmail } from './input-email';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedModule } from '../../services/shared/shared.modules';
import { By } from '@angular/platform-browser';
import { AuthService } from '../../services/auth.service';
import { of } from 'rxjs';
import { emailExistsValidator } from '../../validators/email-exists.validator';

class MockAuthService {
  getUserByEmail(email: string) {
    if (email === 'existing@example.com') {
      return of({ id: 1, email });
    }
    return of(null);
  }
}

describe('InputEmail', () => {
  let component: InputEmail;
  let fixture: ComponentFixture<InputEmail>;
  let authService: AuthService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      providers: [
        { provide: AuthService, useClass: MockAuthService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputEmail);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);

    component.formGroup = new FormGroup({
      email: new FormControl(
        { value: null, disabled: false },
        {
          validators: [Validators.required, Validators.email],
          asyncValidators: [emailExistsValidator(authService)],
          updateOn: 'change'
        }
      )
    });
    component.controlName = 'email';
    component.required = true;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update control value on input and validate sync', () => {
    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;

    inputEl.value = 'test@example.com';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.control.value).toBe('test@example.com');
    expect(component.control.valid).toBeTrue();
  });

  it('should show required error message', () => {
    component.control.setValue('');
    component.control.markAsTouched();
    component.control.markAsDirty();
    fixture.detectChanges();

    expect(component.isInvalid).toBe('Campo obrigatório');
  });

  it('should show email invalid error message', () => {
    component.control.setValue('invalid-email');
    component.control.markAsTouched();
    component.control.markAsDirty();
    fixture.detectChanges();

    expect(component.isInvalid).toBe('Email inválido');
  });

  it('should detect emailExists error asynchronously', fakeAsync(() => {
    component.control.setValue('existing@example.com');
    component.control.markAsTouched();
    component.control.markAsDirty();
    fixture.detectChanges();

    expect(component.control.hasError('emailExists')).toBeTrue();
    expect(component.isInvalid).toBe('Este e-mail já está cadastrado');
  }));

  it('should not show emailExists error for new email', fakeAsync(() => {
    component.control.setValue('new@example.com');
    component.control.markAsTouched();
    component.control.markAsDirty();
    fixture.detectChanges();

    expect(component.control.hasError('emailExists')).toBeFalse();
    expect(component.isInvalid).toBeNull();
  }));
});
