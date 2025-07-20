import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
})
export class NavigationComponent {
  @Input() collapsed = false;
  navLinks = navLinks;

  trackBy(index: number, el: any) {
    return el.link;
  }
}

export const navLinks = [
  {
    link: '/accueil',
    icon: 'home',
    libelle: 'Acceuil',
    desc: "Page d'accueil",
    condition: true,
  },
  {
    link: '/pointages/horaires',
    icon: 'edit_calendar',
    libelle: 'Pointage horaires',
    desc: 'Pointage horaires',
    condition: true,
  },
  {
    link: '/pointages/salaries',
    icon: 'work_history',
    libelle: 'Pointage salariés',
    desc: 'Pointage salariés',
    condition: true,
  },
].filter((l) => l.condition);
