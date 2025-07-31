import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { InputName } from '../../components/input-name/input-name';
import { InputEmail } from '../../components/input-email/input-email';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    DatePickerModule,
    InputName,
    InputEmail
  ],
  exports: [
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    DatePickerModule,
    InputName,
    InputEmail
  ]
})
export class SharedModule {}
