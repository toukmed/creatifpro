import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
})
export class NavigationComponent implements OnInit {
  @Input() collapsed = false;

  navLinks = navLinks;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  onLogout(): void {
    window.localStorage.removeItem('auth_token');
    this.router.navigate(['login']);
  }

  trackBy(index: number, el: any) {
    return el.link;
  }
}

export const navLinks = [
  {
    link: '/accueil',
    icon: 'home',
    libelle: 'Accueil',
    desc: "Page d'accueil",
    condition: true,
  },
  {
    link: '/pointages',
    icon: 'edit_calendar',
    libelle: 'Pointages',
    desc: 'Pointages',
    condition: true,
  },
  {
    link: '/employees',
    icon: 'work_history',
    libelle: 'Employés',
    desc: 'Employés',
    condition: true,
  },
].filter((l) => l.condition);
