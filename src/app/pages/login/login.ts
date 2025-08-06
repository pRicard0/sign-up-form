import { Component, inject } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ConstructorsService } from '../../services/constructors.service';
import { SharedModule } from '../../services/shared/shared.modules';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  loginForm!: FormGroup;
  private authService = inject(AuthService)
  private router = inject(Router)
  private messageService = inject(MessageService)
  store = inject(Store)

  constructor(
    private dep: ConstructorsService,
  ) {}

  ngOnInit() {
    this.loginForm = this.dep.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      const raw = this.loginForm.value; 

      this.authService.getUserDetails(raw.email).subscribe({
        next: response => {
          if (response.length == 1) {
            localStorage.setItem('email', raw.email)
            this.router.navigate(['home'])
            console.log(response)
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Não existe uma conta com este email'
            });
          }
        }
      })
    }
    console.log('Form submitted:');
  }
}
