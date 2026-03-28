import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SecurityService } from '../services/guards/security.service';

export interface NavLink {
  link: string;
  icon: string;
  libelle: string;
  desc: string;
  roles?: string[];
}

export const navLinks: NavLink[] = [
  {
    link: '/accueil',
    icon: 'home',
    libelle: 'Accueil',
    desc: "Page d'accueil",
  },
  {
    link: '/pointages',
    icon: 'edit_calendar',
    libelle: 'Pointages',
    desc: 'Pointages',
  },
  {
    link: '/employees',
    icon: 'work_history',
    libelle: 'Employés',
    desc: 'Employés',
    roles: ['SUPER_ADMIN', 'ADMIN'],
  },
  {
    link: '/projets',
    icon: 'folder_open',
    libelle: 'Projets',
    desc: 'Projets',
    roles: ['SUPER_ADMIN', 'ADMIN'],
  },
  {
    link: '/materiels',
    icon: 'construction',
    libelle: 'Matériels',
    desc: 'Matériels',
    roles: ['SUPER_ADMIN', 'ADMIN'],
  },
  {
    link: '/factures',
    icon: 'receipt_long',
    libelle: 'Factures',
    desc: 'Factures',
    roles: ['SUPER_ADMIN', 'ADMIN'],
  },
  {
    link: '/stock',
    icon: 'warehouse',
    libelle: 'Stock',
    desc: 'Stock',
    roles: ['SUPER_ADMIN', 'ADMIN'],
  },
  {
    link: '/fiche-paie',
    icon: 'description',
    libelle: 'Fiche de paie',
    desc: 'Fiche de paie',
    roles: ['SUPER_ADMIN', 'ADMIN'],
  },
  {
    link: '/utilisateurs',
    icon: 'group',
    libelle: 'Utilisateurs',
    desc: 'Utilisateurs',
    roles: ['SUPER_ADMIN', 'ADMIN'],
  },
];

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
})
export class NavigationComponent implements OnInit {
  @Input() collapsed = false;

  navLinks: NavLink[] = [];

  constructor(
    private router: Router,
    private securityService: SecurityService
  ) {}

  ngOnInit(): void {
    const userRole = this.securityService.getUserRole();
    this.navLinks = navLinks.filter(
      (link) => !link.roles || (userRole && link.roles.includes(userRole))
    );
  }

  onLogout(): void {
    this.securityService.clearAuthToken();
    this.router.navigate(['login']);
  }

  trackBy(index: number, el: NavLink) {
    return el.link;
  }
}
