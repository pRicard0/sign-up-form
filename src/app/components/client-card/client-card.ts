import { Component, Input } from '@angular/core';
import { User } from '../../interfaces/user';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-card',
  standalone: true,
  imports: [CommonModule, CardModule],
  templateUrl: './client-card.html',
  styleUrl: './client-card.css'
})
export class ClientCard {
  @Input() user!: User;
}
