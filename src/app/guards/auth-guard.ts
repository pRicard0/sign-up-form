import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { URL } from '../services/shared/strings';

export const authGuard: CanActivateFn = (route, state) => {
  if(localStorage.getItem('email')) {
    return true;
  } else {
    const router = inject(Router);
    router.navigate([URL.LOGIN_URL])
    return false
  }
};