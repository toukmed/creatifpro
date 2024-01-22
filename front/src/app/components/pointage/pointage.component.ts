import { Component } from '@angular/core';
import { columns } from './pointage.variables';

@Component({
  selector: 'app-pointage',
  templateUrl: './pointage.component.html',
  styleUrl: './pointage.component.scss',
})
export class PointageComponent {
  readonly columns = columns;

  pointages: any = {
    content: [
      {
        nom: 'Toukrichte',
        prenom: 'Mohamed',
        typeContrat: 'CDI',
        projet: 'LEAR',
        totalJrsTravailles: 25,
        tarifJournaliere: 800,
        tarifHoraire: 100,
        periode: 'du 01/01/2024 au 31/01/2024',
        total: 20000,
      },
      {
        nom: 'Toukrichte',
        prenom: 'Ayoub',
        typeContrat: 'Horaire',
        projet: 'HALLASSA',
        totalJrsTravailles: 24,
        tarifJournaliere: 200,
        tarifHoraire: 25,
        periode: 'du 01/01/2024 au 31/01/2024',
        total: 5000,
      },
      {
        nom: 'El Amrani',
        prenom: 'Mohamed',
        typeContrat: 'CDI',
        projet: 'NEARSHORE',
        totalJrsTravailles: 25,
        tarifJournaliere: 300,
        tarifHoraire: 35,
        periode: 'du 01/01/2024 au 31/01/2024',
        total: 7500,
      },
      {
        nom: 'El Amrani',
        prenom: 'Ismail',
        typeContrat: 'CDI',
        projet: 'LEAR',
        totalJrsTravailles: 25,
        tarifJournaliere: 180,
        tarifHoraire: 20,
        periode: 'du 01/01/2024 au 31/01/2024',
        total: 4800,
      },
      {
        nom: 'Tazouinte',
        prenom: 'Hamid',
        typeContrat: 'Horaire',
        projet: 'Grand stade Benslimane',
        totalJrsTravailles: 25,
        tarifJournaliere: 150,
        tarifHoraire: 18,
        periode: 'du 01/01/2024 au 31/01/2024',
        total: 4200,
      },
    ],
    total: 5,
    number: 0,
  };
}
