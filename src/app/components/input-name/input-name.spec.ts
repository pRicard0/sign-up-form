import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputName } from './input-name';
import { SharedModule } from '../../services/shared/shared.modules';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('InputName', () => {
  let component: InputName;
  let fixture: ComponentFixture<InputName>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule]
    }).compileComponents();

    fixture = TestBed.createComponent(InputName);
    component = fixture.componentInstance;

    component.formGroup = new FormGroup({
      name: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(150),
      ])
    });

    component.controlName = 'name';
    component.required = true;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update control value on input', () => {
    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;

    inputEl.value = 'João da Silva';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.control.value).toBe('João da Silva');
    expect(component.control.valid).toBeTrue();
  });

  it('should show required error', () => {
    const control = component.control;
    control.markAsTouched();
    control.setValue('');
    fixture.detectChanges();

    expect(component.isInvalid).toBe('Campo obrigatório');
    const errorMsg = fixture.debugElement.query(By.css('.error-message small')).nativeElement.textContent;
    expect(errorMsg).toContain('Campo obrigatório');
  });

  it('should show minlength error', () => {
    const control = component.control;
    control.markAsTouched();
    control.setValue('Jo');
    fixture.detectChanges();

    expect(component.isInvalid).toContain('no mínimo 3 caracteres');
  });

  it('should show maxlength error', () => {
    const control = component.control;
    control.markAsTouched();
    control.setValue('A'.repeat(151));
    fixture.detectChanges();

    expect(component.isInvalid).toContain('no máximo 150 caracteres');
  });

  it('should return charSize + 1 for maxCharSize getter when charSize is set', () => {
    component.charSize = '10';
    expect(component.maxCharSize).toBe(11);
  });
});
