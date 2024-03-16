import { Component } from '@angular/core';

@Component({
  selector: 'app-visu-page',
  template: ` <app-edit-page [isReadOnly]="true" /> `,
})
export class VisuPageComponent {}
