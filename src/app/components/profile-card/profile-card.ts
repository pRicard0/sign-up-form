import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { User } from '../../interfaces/user';
import { formatCpf } from '../../functions/formatCpf';
import { formatPhoneNumber } from '../../functions/formatPhoneNumber';
import { formatDate } from '../../functions/formatDate';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './profile-card.html',
  styleUrls: ['./profile-card.css'],
})
export class ProfileCard {
  @Input() user!: User;
  @Output() editEvent = new EventEmitter<string>();
  @Input() logout!: () => void;

  constructor(public sidebarService: SidebarService) {}

  get formattedCpf(): string {
    return this.user ? formatCpf(this.user.cpf) : '';
  }

  get formattedPhone(): string {
    return this.user ? formatPhoneNumber(this.user.number) : '';
  }

  get formattedBirthDate(): string {
    return this.user ? formatDate(this.user.birthDate) : '';
  }

  onEdit() {
    this.editEvent.emit(this.user.email); 
  }
}