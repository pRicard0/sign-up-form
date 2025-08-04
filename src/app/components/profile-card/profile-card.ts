import { Component, inject, Input } from '@angular/core';
import { SharedModule } from '../../services/shared/shared.modules';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { User } from '../../interfaces/user';
import { formatCpf } from '../../functions/formatCpf';
import { formatPhoneNumber } from '../../functions/formatPhoneNumber';
import { formatDate } from '../../functions/formatDate';

@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './profile-card.html',
  styleUrls: ['./profile-card.css'],
})
export class ProfileCard {
  @Input() user: User | null = null;

  @Input() logout!: () => void; // receber função do pai

  get formattedCpf(): string {
    return this.user ? formatCpf(this.user.cpf) : '';
  }

  get formattedPhone(): string {
    return this.user ? formatPhoneNumber(this.user.number) : '';
  }

  get formattedBirthDate(): string {
    return this.user ? formatDate(this.user.birthDate) : '';
  }
}