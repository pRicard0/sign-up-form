import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { InputName } from '../../components/input-name/input-name';
import { InputEmail } from '../../components/input-email/input-email';
import { InputCpf } from '../../components/input-cpf/input-cpf';
import { DatePicker } from '../../components/date-picker/date-picker';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    DatePickerModule,
    InputName,
    InputEmail,
    InputCpf,
    DatePicker
  ],
  exports: [
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    DatePickerModule,
    InputName,
    InputEmail,
    InputCpf,
    DatePicker
  ]
})
export class SharedModule {}
