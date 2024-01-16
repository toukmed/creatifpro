import {
  animate,
  group,
  query,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, HostBinding } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OverlayContainer } from '@angular/cdk/overlay';

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
})
export class AppComponent {
  sidenavOpened = true;
  @HostBinding('class.dark') isDark: boolean = true;
  @HostBinding('class.light') isLight: boolean = false;
  @HostBinding('class.pink_bluegrey') isPinkBlueGrey: boolean = true;
  @HostBinding('class.indigo_pink') isIndigoPink: boolean = false;
  @HostBinding('class.purple_green') isPurpleGreen: boolean = false;
  @HostBinding('class.amber_bluegrey') isAmberBlueGrey: boolean = false;

  constructor(private overlayContainer: OverlayContainer) {
    this.overlayContainer.getContainerElement().classList.add('dark');
    this.overlayContainer.getContainerElement().classList.add('pink_bluegrey');
  }

  prepareRoute(outlet: RouterOutlet) {
    return (
      outlet &&
      outlet.activatedRouteData &&
      outlet.activatedRouteData['animation']
    );
  }

  setDarkTheme($event: boolean) {
    this.isDark = $event;
    this.isLight = !$event;
    if ($event) {
      this.overlayContainer.getContainerElement().classList.remove('light');
      this.overlayContainer.getContainerElement().classList.add('dark');
    } else {
      this.overlayContainer.getContainerElement().classList.remove('dark');
      this.overlayContainer.getContainerElement().classList.add('light');
    }
  }

  setTheme(event: string) {
    if (event === 'pink') {
      this.isPinkBlueGrey = true;
      this.isIndigoPink = false;
      this.isPurpleGreen = false;
      this.isAmberBlueGrey = false;
      this.overlayContainer
        .getContainerElement()
        .classList.remove('indigo_pink');
      this.overlayContainer
        .getContainerElement()
        .classList.remove('purple_green');
      this.overlayContainer
        .getContainerElement()
        .classList.remove('amber_bluegrey');
      this.overlayContainer
        .getContainerElement()
        .classList.add('pink_bluegrey');
    } else if (event === 'indigo') {
      this.isPinkBlueGrey = false;
      this.isIndigoPink = true;
      this.isPurpleGreen = false;
      this.isAmberBlueGrey = false;
      this.overlayContainer
        .getContainerElement()
        .classList.remove('pink_bluegrey');
      this.overlayContainer
        .getContainerElement()
        .classList.remove('purple_green');
      this.overlayContainer
        .getContainerElement()
        .classList.remove('amber_bluegrey');
      this.overlayContainer.getContainerElement().classList.add('indigo_pink');
    } else if (event === 'purple') {
      this.isPinkBlueGrey = false;
      this.isIndigoPink = false;
      this.isAmberBlueGrey = false;
      this.isPurpleGreen = true;
      this.overlayContainer
        .getContainerElement()
        .classList.remove('pink_bluegrey');
      this.overlayContainer
        .getContainerElement()
        .classList.remove('indigo_pink');
      this.overlayContainer
        .getContainerElement()
        .classList.remove('amber_bluegrey');
      this.overlayContainer.getContainerElement().classList.add('purple_green');
    } else if (event === 'amber') {
      this.isPinkBlueGrey = false;
      this.isIndigoPink = false;
      this.isAmberBlueGrey = true;
      this.isPurpleGreen = false;
      this.overlayContainer
        .getContainerElement()
        .classList.remove('pink_bluegrey');
      this.overlayContainer
        .getContainerElement()
        .classList.remove('indigo_pink');
      this.overlayContainer
        .getContainerElement()
        .classList.remove('purple_green');
      this.overlayContainer
        .getContainerElement()
        .classList.add('amber_bluegrey');
    }
  }

  toggleSidenav() {
    this.sidenavOpened = !this.sidenavOpened;
  }
}
