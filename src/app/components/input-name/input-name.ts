import { Component, inject, Input } from '@angular/core';
import { ControlContainer, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-input-name',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule],
  templateUrl: './input-name.html',
  styleUrl: './input-name.css',
  viewProviders: [
    { 
      provide: ControlContainer, 
      useFactory: () => inject(ControlContainer, {skipSelf: true})
    }
  ]
})
export class InputName {
  @Input() formGroup!: FormGroup;
  @Input() charSize!: string;
  @Input() minCharSize!: string;
  @Input() required!: boolean;
  @Input() controlName!: string;

  get control(): FormControl {
    return this.formGroup.get(this.controlName) as FormControl;
  }

  get isInvalid(): string | null {
    const control = this.control;
    const maxChar = this.charSize ? this.charSize : '150';
    const minChar = this.minCharSize ? this.minCharSize : '3';;
    if (control?.invalid && (control.dirty || control.touched)) {
      if (control.hasError('required')) {
        return 'Campo obrigatório';
      }
      if (control.hasError('maxlength')) {
        return `Nome deve ter no máximo ${maxChar} caracteres`;
      }
      if (control.hasError('minlength')) {
        return `Nome deve ter no mínimo ${minChar} caracteres`;
      }
    }
    return null;
  }

  get maxCharSize(): number {
    if (this.charSize) {
      return Number(this.charSize) + 1;
    }
    return 151;
  }
}