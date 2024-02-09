import { Component } from '@angular/core';
import { columns } from './personnel.variables';
import { Personnel } from '../../models/personnel';
import { ResourceService } from '../../services/resource.service';

@Component({
  selector: 'app-personnel',
  templateUrl: './personnel.component.html',
  styleUrl: './personnel.component.scss',
})
export class PersonnelComponent {
  readonly columns = columns;

  personnels: Personnel[];

  constructor(private service: ResourceService<Personnel>) {}

  ngOnInit(): void {
    this.service.list({ libelle: '' }, 'employees').subscribe((resp) => {
      console.log(resp.content);
      this.personnels = resp.content;
    });
  }
}
