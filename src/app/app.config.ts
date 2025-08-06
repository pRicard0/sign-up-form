import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import Aura from '@primeuix/themes/aura';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { deleteUserEffect, getUserDetailsEffect, getUsersEffect } from './store/user.effects';
import { appReducers } from './store/app.reducers';
import { HttpErrorInterceptor } from './interceptors/http-error-interceptor';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([HttpErrorInterceptor])),
    provideAnimationsAsync(),
    provideEnvironmentNgxMask(),
    providePrimeNG({
        theme: {
            preset: Aura,
            options: {
                prefix: 'p',
                darkModeSelector: '.my-app-dark',
                cssLayer: {
                    name: 'primeng',
                    order: 'theme, base, primeng'
                }
            }
        },
        ripple: true,
    }),
    provideStore(appReducers),
    provideEffects({getUsersEffect, getUserDetailsEffect, deleteUserEffect}),
    importProvidersFrom(ToastModule),
    MessageService
  ]
};