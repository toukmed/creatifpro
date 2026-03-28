import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { SecurityService } from '../services/guards/security.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  @Input() sidebarCollapsed = false;
  @Output() toggleSidebar = new EventEmitter<void>();

  breadcrumbs: string[] = ['Accueil'];
  userName: string | null = null;
  userInitials = '';
  userRole = '';

  constructor(
    private router: Router,
    private securityService: SecurityService
  ) {}

  ngOnInit(): void {
    // Breadcrumbs
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const segments = event.url.split('/').filter(s => s && !s.startsWith('?'));
        this.breadcrumbs = segments.length > 0
          ? segments.map(s => this.formatSegment(s))
          : ['Accueil'];
      });

    // User info
    this.userName = this.securityService.getUserName();
    if (this.userName) {
      const parts = this.userName.split(' ').filter(Boolean);
      this.userInitials = parts.map(p => p[0]).join('').toUpperCase().slice(0, 2);
    }
    const role = this.securityService.getUserRole();
    this.userRole = this.formatRole(role);
  }

  private formatSegment(segment: string): string {
    return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
  }

  private formatRole(role: string | null): string {
    switch (role) {
      case 'SUPER_ADMIN': return 'Super Admin';
      case 'ADMIN': return 'Administrateur';
      case 'USER': return 'Utilisateur';
      default: return role ?? '';
    }
  }
}
