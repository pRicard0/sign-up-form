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
import { InputNumber } from '../../components/input-number/input-number';
import { InputCountry } from '../../components/input-country/input-country';
import { InputState } from '../../components/input-state/input-state';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProfileCard } from '../../components/profile-card/profile-card';
import { ClientCard } from '../../components/client-card/client-card';
import { ClientFilters } from '../../components/client-filters/client-filters';
import { PaginatorModule } from 'primeng/paginator';
import { Header } from '../../components/header/header';
import { ModalConfirmation } from '../../components/modal-confirmation/modal-confirmation';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    CardModule,
    ButtonModule,
    DatePickerModule,
    InputName,
    InputEmail,
    InputCpf,
    DatePicker,
    InputNumber,
    InputCountry,
    InputState,
    ProfileCard,
    ClientCard,
    ClientFilters,
    PaginatorModule,
    Header,
    ModalConfirmation,
  ],
  exports: [
    ReactiveFormsModule,
    CardModule,
    RouterLink,
    ButtonModule,
    DatePickerModule,
    InputName,
    InputEmail,
    InputCpf,
    DatePicker,
    InputNumber,
    InputCountry,
    InputState,
    ProfileCard,
    ClientCard,
    ClientFilters,
    PaginatorModule,
    Header,
    ModalConfirmation
  ]
})
export class SharedModule {}