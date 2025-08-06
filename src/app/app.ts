import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrimeNG } from 'primeng/config';
import { TRANSLATION_PT } from './locale/pt-BR.primeng';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('sign-up-form');

  constructor(public _config: PrimeNG) {
    const currentLocale = 'pt-BR';
    this.setLocale(this._config, currentLocale);
  }

  setLocale( config: PrimeNG, locale: string ): void {
    switch(locale) {
      case 'pt-BR': {
        config.setTranslation(TRANSLATION_PT);
        break;
      }
    }
  }
}
