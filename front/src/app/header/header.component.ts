import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  @Input() sidebarCollapsed = false;
  @Output() toggleSidebar = new EventEmitter<void>();

  breadcrumbs: string[] = ['Accueil'];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const segments = event.url.split('/').filter(s => s && !s.startsWith('?'));
        this.breadcrumbs = segments.length > 0
          ? segments.map(s => this.formatSegment(s))
          : ['Accueil'];
      });
  }

  private formatSegment(segment: string): string {
    return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
  }
}
