import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-validation-buttons',
  templateUrl: './validation-buttons.component.html',
  styleUrl: './validation-buttons.component.scss',
})
export class ValidationButtonsComponent {
  @Input()
  disabled = false;
}
