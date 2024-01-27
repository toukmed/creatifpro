import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  readonly login = 'login';
  readonly tooltipMessage = 'Se déconnecter';

  showHeader = false;

  constructor(private router: Router) {}

  onLogout() {
    window.localStorage.removeItem('auth_token');
    this.router.navigate(['login']);
  }
}
