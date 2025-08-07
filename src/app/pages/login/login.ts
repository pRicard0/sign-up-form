import { Component, inject } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ConstructorsService } from '../../services/constructors.service';
import { SharedModule } from '../../services/shared/shared.modules';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Store } from '@ngrx/store';
import { TOASTMESSAGE, URL } from '../../services/shared/strings';
import { LogService } from '../../services/log.service';

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
  private logService = inject(LogService)
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
            this.logService.info(TOASTMESSAGE.LOGIN_SUCCESS)
            localStorage.setItem('email', raw.email)
            this.router.navigate([URL.HOME_URL])

          } else {
            this.logService.error(TOASTMESSAGE.LOGIN_EMAIL_ERROR)
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: TOASTMESSAGE.LOGIN_EMAIL_ERROR
            });
          }
        }
      })
    }
  }
}
