import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePicker } from './date-picker';
import { SharedModule } from '../../services/shared/shared.modules';
import { FormControl, FormGroup } from '@angular/forms';

  describe('DatePicker', () => {
    let component: DatePicker;
    let fixture: ComponentFixture<DatePicker>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [SharedModule]
      })
      .compileComponents();

      fixture = TestBed.createComponent(DatePicker);
      component = fixture.componentInstance;

      component.formGroup = new FormGroup({
          birthDate: new FormControl(null)
      });
      component.controlName = 'birthDate',
      component.required = true;

      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should return the form control', () => {
      const control = component.control;
      const expectedControl = component.formGroup.get(component.controlName);
      expect(expectedControl).not.toBeNull();
      expect(control).toBeTruthy();
      expect(control).toBe(expectedControl as FormControl);
    });

    it('should return error message when required and touched', () => {
      const control = component.control;
      control.markAsTouched();
      control.setErrors({ required: true });

      expect(component.isInvalid).toBe('Campo obrigatório');
    });

    it('should return null if the control is valid', () => {
      const control = component.control;
      control.setValue('2023-01-01');
      control.markAsTouched();

      expect(component.isInvalid).toBeNull();
    });


    it('should show error message when required and touched', () => {
      const control = component.control;
      control.setErrors({ required: true });
      control.markAsTouched();
      fixture.detectChanges();

      const errorEl: HTMLElement = fixture.nativeElement.querySelector('.error-message small');
      expect(errorEl).toBeTruthy();
      expect(errorEl.textContent).toContain('Campo obrigatório');
    });
 });
