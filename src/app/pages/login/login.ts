import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputText } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ FormsModule, CardModule, InputText, ButtonModule ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  login = {
    name: '',
    email: '',
    password: ''
  }

  onLogin() {
    console.log('Form submitted:', this.login);
  }
}
