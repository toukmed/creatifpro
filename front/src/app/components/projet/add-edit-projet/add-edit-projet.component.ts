import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-edit-projet',
  templateUrl: './add-edit-projet.component.html',
  styleUrl: './add-edit-projet.component.scss',
})
export class AddEditProjetComponent {
  addProjetForm: FormGroup = new FormGroup({
    id: new FormControl(''),
    nom: new FormControl(''),
    reference: new FormControl(''),
  });
  isCreating = false;

  close() {}

  save() {}
}
