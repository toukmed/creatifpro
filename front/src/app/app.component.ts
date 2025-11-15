import {
  animate,
  group,
  query,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

export const slider = trigger('routeAnimations', [
  transition('root => edit', slideTo('left')),
  transition('edit => root', slideTo('right')),
]);

function slideTo(direction: any) {
  const optional = { optional: true };
  const value = direction === 'left' ? '100%' : '-100%';
  const oppositeValue = value === '100%' ? '-100%' : '100%';
  const speed = '.5';
  return [
    query(
      ':enter, :leave',
      style({ position: 'fixed', width: '100%' }),
      optional
    ),
    group([
      query(
        ':enter',
        [
          style({ transform: `translateX(${value})` }),
          animate(`${speed}s ease-out`, style({ transform: 'translateX(0%)' })),
        ],
        optional
      ),
      query(
        ':leave',
        [
          style({ transform: 'translateX(0%)' }),
          animate(
            `${speed}s ease-out`,
            style({ transform: `translateX(${oppositeValue})` })
          ),
        ],
        optional
      ),
    ]),
  ];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [slider],
})
export class AppComponent {
  navLinks = navLinks;

  constructor() {}

  showHeader() {
    let token = localStorage.getItem('auth_token');
    if (token !== null) {
      let decodedToken = jwtDecode(token);
      const isExpired =
        decodedToken && decodedToken.exp
          ? decodedToken.exp < Date.now() / 1000
          : false;
      if (isExpired) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  slider = trigger('routeAnimations', [
    transition('root => edit', slideTo('left')),
    transition('edit => root', slideTo('right')),
  ]);

  prepareRoute(outlet: RouterOutlet) {
    return (
      outlet &&
      outlet.activatedRouteData &&
      outlet.activatedRouteData['animation']
    );
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
