import { Component, OnInit } from '@angular/core';
import { navLinks, NavLink } from '../navigation/navigation.component';
import { SecurityService } from '../services/guards/security.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  navLinks: NavLink[] = [];
  userName: string | null = null;
  greeting = '';
  todayDate = new Date();

  constructor(private securityService: SecurityService) {}

  ngOnInit(): void {
    this.userName = this.securityService.getUserName();
    this.greeting = this.getGreeting();

    const userRole = this.securityService.getUserRole();
    this.navLinks = navLinks.filter(
      (link) =>
        link.link !== '/accueil' &&
        (!link.roles || (userRole && link.roles.includes(userRole)))
    );
  }

  private getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  }

  trackBy(index: number, el: NavLink) {
    return el.link;
  }
}
