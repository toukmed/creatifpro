import { Component } from '@angular/core';
import { navLinks } from '../navigation/navigation.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  navLinks = navLinks;

  trackBy(index: number, el: any) {
    return el.link;
  }
}
