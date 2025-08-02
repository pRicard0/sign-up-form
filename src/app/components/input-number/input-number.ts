import { Component, inject, Input } from '@angular/core';
import { ControlContainer, FormControl, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { NgxMaskDirective } from 'ngx-mask';
import { TelephoneTypeValidatorDirective } from '../../directives/telephone.validator.directive';

interface Contact {
    name: string;
}

@Component({
  selector: 'app-input-number',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, InputTextModule, NgxMaskDirective, SelectModule, TelephoneTypeValidatorDirective],
  templateUrl: './input-number.html',
  styleUrl: './input-number.css',
  viewProviders: [
    { 
      provide: ControlContainer, 
      useFactory: () => inject(ControlContainer, {skipSelf: true})
    }
  ]
})
export class InputNumber {
  @Input() formGroup!: FormGroup;
  @Input() required!: boolean;
  @Input() controlName!: string;
  @Input() typeControlName!: string;

  contacts!: Contact[];
  selectedContact!: Contact | null;

  ngOnInit() {
    this.contacts = [
      { name: 'Celular' },
      { name: 'Residencial' },
      { name: 'Whatsapp' } 
    ]

    const control = this.control;
    if (control) {
      control.valueChanges.subscribe((value: string) => {
        const raw = (value || '').replace(/\D/g, '');

        this.updateSelectedContact(raw);
      });
    }
  }

  get control(): FormControl {
    return this.formGroup.get(this.controlName) as FormControl;
  }

  get isInvalid(): string | null {
    const control = this.control;
    if (control?.invalid && (control.dirty || control.touched)) {
      if (control.hasError('required')) return 'Campo obrigatório';
      if (control.hasError('minlength')) return 'Telefone inválido';
      if (control.hasError('invalidType')) return 'Telefone residencial inválido';
    }
    return null;
  }

  updateSelectedContact(raw: string) {
    const typeControl = this.formGroup.get(this.typeControlName);
    const currentType = typeControl?.value?.name || typeControl?.value;

    if (currentType === 'Whatsapp') {
      console.log('Mantendo o tipo "Whatsapp"');
      return;
    } else if (raw.length === 11 && raw[2] === '9') {
      console.log('Selecionando o tipo "Celular"');
      const celular = this.contacts.find(c => c.name === 'Celular');
      this.selectedContact = celular!;
      typeControl?.setValue(celular, { emitEvent: false });
    } else if (raw.length === 10) {
      console.log('Selecionando o tipo "Residencial"');
      const residencial = this.contacts.find(c => c.name === 'Residencial');
      this.selectedContact = residencial!;
      typeControl?.setValue(residencial, { emitEvent: false });
    }
  }

  onContactTypeChanged() {
    this.control.setValue('');
  }
}