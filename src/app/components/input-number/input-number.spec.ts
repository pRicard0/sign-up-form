import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputNumber } from './input-number';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { FormGroup, FormControl, Validators } from '@angular/forms';

describe('InputNumber', () => {
  let component: InputNumber;
  let fixture: ComponentFixture<InputNumber>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputNumber],
      providers: [provideEnvironmentNgxMask()]
    }).compileComponents();

    fixture = TestBed.createComponent(InputNumber);
    component = fixture.componentInstance;

    component.formGroup = new FormGroup({
      phone: new FormControl('', [Validators.required, Validators.minLength(10)]),
      type: new FormControl(null),
    });

    component.controlName = 'phone';
    component.typeControlName = 'type';
    component.required = true;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show required error message', () => {
    const control = component.control;
    control.markAsTouched();
    control.setValue('');
    fixture.detectChanges();

    expect(component.isInvalid).toBe('Campo obrigatório');

    const errorMsg = fixture.nativeElement.querySelector('.error-message small')?.textContent;
    expect(errorMsg).toContain('Campo obrigatório');
  });

  it('should select "Celular" when input has 11 digits starting with 9', () => {
    const phoneControl = component.control;
    const typeControl = component.formGroup.get('type');

    phoneControl.setValue('(11) 91234-5678');
    fixture.detectChanges();

    expect(typeControl?.value?.name).toBe('Celular');
  });


  it('should select "Residencial" when input has 10 digits', () => {
    const phoneControl = component.control;
    const typeControl = component.formGroup.get('type');

    phoneControl.setValue('(11) 1234-5678');
    fixture.detectChanges();

    expect(typeControl?.value?.name).toBe('Residencial');
  });

  it('should not change type if current type is "Whatsapp"', () => {
    const phoneControl = component.control;
    const typeControl = component.formGroup.get('type');

    typeControl?.setValue({ name: 'Whatsapp' });

    phoneControl.setValue('(11) 91234-5678');
    fixture.detectChanges();

    expect(typeControl?.value?.name).toBe('Whatsapp');
  });

  it('should clear phone input value when contact type changes', () => {
    const phoneControl = component.control;
    phoneControl.setValue('(11) 91234-5678');

    component.onContactTypeChanged();
    fixture.detectChanges();

    expect(phoneControl.value).toBe('');
  });

  it('should show "Telefone inválido" error when value is too short', () => {
    const phoneControl = component.control;
    phoneControl.setValue('(11) 1234');
    phoneControl.markAsTouched();
    fixture.detectChanges();

    expect(component.isInvalid).toBe('Telefone inválido');
  });

  it('should return invalidType error when Celular is selected but number is invalid', () => {
    const phoneControl = component.control;
    const typeControl = component.formGroup.get('type');

    typeControl?.setValue({ name: 'Celular' });
    phoneControl.setValue('(11) 81234-5678');
    phoneControl.markAsTouched();
    fixture.detectChanges();

    expect(component.isInvalid).toBe('Telefone residencial inválido');
  });

  it('should pass validation when type is Whatsapp and number is any valid length', () => {
    const phoneControl = component.control;
    const typeControl = component.formGroup.get('type');

    typeControl?.setValue({ name: 'Whatsapp' });
    phoneControl.setValue('(11) 1234-5678');
    phoneControl.markAsTouched();
    fixture.detectChanges();

    expect(component.isInvalid).toBeNull();
    expect(phoneControl.valid).toBeTrue();
  });
});
