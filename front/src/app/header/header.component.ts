import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  readonly login = 'login';
  readonly tooltipMessage = 'Se déconnecter';

  currentUrl: string = 'accueil';


  showHeader = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe((event: NavigationEnd) => {

        // URI without query params
        const segments = event.url.split('/').filter(segment => segment);

        // Join segments with ' -> '
        this.currentUrl = segments.join(' -> ');
        console.log(this.currentUrl);
      });
  }

  onLogout() {
    window.localStorage.removeItem('auth_token');
    this.router.navigate(['login']);
  }
}
