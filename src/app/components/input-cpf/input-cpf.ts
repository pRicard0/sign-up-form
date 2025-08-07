import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { NgxMaskDirective } from 'ngx-mask';
import { CpfValidatorDirective } from '../../validators/directives/cpf.validator.directive';

@Component({
  selector: 'app-input-cpf',
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, NgxMaskDirective, CpfValidatorDirective],
  templateUrl: './input-cpf.html',
  styleUrl: './input-cpf.css'
})
export class InputCpf {
  @Input() formGroup!: FormGroup;
  @Input() required!: boolean;
  @Input() controlName!: string;

  get control(): FormControl {
    return this.formGroup.get(this.controlName) as FormControl;
  }

  get isRequired(): boolean {
    const control = this.formGroup.get(this.controlName);
    if (!control || !control.validator) return false;

    const validator = control.validator({} as any);
    return validator && validator['required'];
  }

  get isInvalid(): string | null {
    const control = this.control;
    if (control?.invalid && (control.dirty || control.touched)) {
      if (control.hasError('required')) {
        return 'Campo obrigatório';
      }
      if (control.hasError('invalidCPF')) {
        return `CPF inválido`;
      }
    }
    return null;
  }
}