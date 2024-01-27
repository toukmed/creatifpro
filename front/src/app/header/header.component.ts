import { Component } from '@angular/core';
import { token } from '../utils/session';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  readonly login = 'login';
  readonly tooltipMessage = 'Se déconnecter';

  constructor(private router: Router) {}

  onLogout() {
    window.localStorage.removeItem('auth_token');
    this.router.navigate(['login']);
  }
}
