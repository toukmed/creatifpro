import { Component } from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
})
export class NavigationComponent {
  navLinks = navLinks;

  trackBy(index: number, el: any) {
    return el.link;
  }
}

export const navLinks = [
  {
    link: '/pointages',
    icon: 'edit_calendar',
    libelle: 'Pointage',
    desc: 'Géstion du Pointage',
    condition: true,
  },
  {
    link: '/employes',
    icon: 'group',
    libelle: 'Personels',
    desc: 'Géstion du Personel',
    condition: true,
  },
  {
    link: '/consommations',
    icon: 'shelves',
    libelle: 'Consommation',
    desc: 'Géstion de la Consommation',
    condition: true,
  },
  {
    link: '/projets',
    icon: 'apartment',
    libelle: 'Projets',
    desc: 'Géstion des Projets',
    condition: true,
  },
  {
    link: '/paiements',
    icon: 'receipt_long',
    libelle: 'Paiements',
    desc: 'Géstion des Paiements',
    condition: true,
  },
  {
    link: '/caisses',
    icon: 'payments',
    libelle: 'Caisse',
    desc: 'Géstion de la Caisse',
    condition: true,
  },
  {
    link: '/devis',
    icon: 'task',
    libelle: 'Devis',
    desc: 'Géstion des Devis',
    condition: true,
  },
  {
    link: '/facturations',
    icon: 'feed',
    libelle: 'Facturation',
    desc: 'Géstion de la Facturation',
    condition: true,
  },
].filter((l) => l.condition);
