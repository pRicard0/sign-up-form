import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import Aura from '@primeuix/themes/aura';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { deleteUserEffect, getUserDetailsEffect, getUsersEffect } from './store/user.effects';
import { appReducers } from './store/app.reducers';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
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
    provideEffects({getUsersEffect, getUserDetailsEffect, deleteUserEffect})
    ]
};