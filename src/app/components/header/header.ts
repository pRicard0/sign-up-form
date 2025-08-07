import { Component, Input } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { URL } from '../../services/shared/strings';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  @Input() logout!: () => void;

  URL = URL

  constructor(private sidebarService: SidebarService) {}

  toggleSidebar() {
    this.sidebarService.toggle();
  }
}