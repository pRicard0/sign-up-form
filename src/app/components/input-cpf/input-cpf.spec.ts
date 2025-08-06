import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputCpf } from './input-cpf';
import { SharedModule } from '../../services/shared/shared.modules';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { FormGroup, FormControl, Validators } from '@angular/forms';

describe('InputCpf', () => {
  let component: InputCpf;
  let fixture: ComponentFixture<InputCpf>;

  const maskConfig = {
    validation: true
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule],
      providers: [provideEnvironmentNgxMask(maskConfig)]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputCpf);
    component = fixture.componentInstance;

    component.formGroup = new FormGroup({
      cpf: new FormControl(null, Validators.required)
    });
    component.controlName = 'cpf';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return true for isRequired when control has required validator', () => {
    const control = component.formGroup.get('cpf')!;
    control.setValidators(Validators.required);
    control.updateValueAndValidity();
    
    expect(component.isRequired).toBeTrue();
  });

  it('should return false for isRequired when control does not have required validator', () => {
    const control = component.formGroup.get('cpf')!;
    control.clearValidators();
    control.updateValueAndValidity();
    
    expect(component.isRequired).toBeFalse();
  });

  it('should return "Campo obrigatório" when control is required and invalid', () => {
    const control = component.control;
    control.setErrors({ required: true });
    control.markAsDirty();
    control.markAsTouched();

    expect(component.isInvalid).toBe('Campo obrigatório');
  });

  it('should return "CPF inválido" when control has invalidCPF error', () => {
    const control = component.control;
    control.setErrors({ invalidCPF: true });
    control.markAsDirty();
    control.markAsTouched();

    expect(component.isInvalid).toBe('CPF inválido');
  });

  it('should return null when control is valid', () => {
    const control = component.control;
    control.setErrors(null);
    control.markAsDirty();
    control.markAsTouched();

    expect(component.isInvalid).toBeNull();
  });
});
