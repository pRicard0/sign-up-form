import { Component, inject, Input } from '@angular/core';
import { ControlContainer, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-date-picker',
  imports: [DatePickerModule, CommonModule, ReactiveFormsModule],
  templateUrl: './date-picker.html',
  styleUrl: './date-picker.css',
  viewProviders: [
    { 
      provide: ControlContainer, 
      useFactory: () => inject(ControlContainer, {skipSelf: true})
    }
  ]
})
export class DatePicker {
  @Input() formGroup!: FormGroup;
  @Input() required!: boolean;
  @Input() controlName!: string;

  get control(): FormControl {
    return this.formGroup.get(this.controlName) as FormControl;
  }

  get isInvalid(): string | null {
    const control = this.control;
    if (control?.invalid && (control.dirty || control.touched)) {
      if (control.hasError('required')) {
        return 'Campo obrigatório';
      }
    }
    return null;
  }
}
