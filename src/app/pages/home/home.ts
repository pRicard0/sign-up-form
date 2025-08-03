import { Component, inject } from '@angular/core';
import { SharedModule } from '../../services/shared/shared.modules';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [SharedModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  private router = inject(Router)
  logout() {
    localStorage.clear()
    this.router.navigate(['login'])
  }
}
