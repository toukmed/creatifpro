import { Component } from '@angular/core';
import { columns } from './personnel.variables';
import { Employe } from '../../models/employe';
import { ResourceService } from '../../services/resource.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-personnel',
  templateUrl: './personnel.component.html',
  styleUrl: './personnel.component.scss',
})
export class PersonnelComponent {
  readonly columns = columns;

  employes: Employe[];

  constructor(
    private service: ResourceService<Employe>,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.service.list({ libelle: '' }, 'employes').subscribe((resp) => {
      this.employes = resp.content;
    });
  }

  searchPersonnels(args: any) {
    this.service.list(args, 'employes').subscribe((resp) => {
      this.employes = resp.content;
    });
  }

  edit(configuration: any, details: boolean) {
    let array = ['employes', configuration.id];
    if (details) array.push('visu');
    this.router.navigate(array);
  }

  add() {
    const fieldsToFilter = ['niveau', 'pilote', 'technologie', 'pole'];
    /* activiteEditFields
      .filter((ef) => fieldsToFilter.includes(ef.name))
      .forEach(
        (ef) =>
          (ef.staticRequestParam = {
            serviceMetierId: this.credentials.selectedServiceMetier?.id,
          })
      ); */

    this.router.navigate(['employes', 'new']);
  }
}
