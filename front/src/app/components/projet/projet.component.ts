import { Component, OnInit } from '@angular/core';
import { columns } from './projet.variables';
import { Projet } from '../../models/projet';
import { ResourceService } from '../../services/resource.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-projet',
  templateUrl: './projet.component.html',
  styleUrl: './projet.component.scss',
})
export class ProjetComponent implements OnInit {
  readonly columns = columns;

  projets: Projet[];

  constructor(
    private service: ResourceService<Projet>,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.service.list({ libelle: '' }, 'projets').subscribe((resp) => {
      this.projets = resp.content;
    });
  }

  searchProjets(args: any) {
    this.service.list(args, 'projets').subscribe((resp) => {
      this.projets = resp.content;
    });
  }

  edit(configuration: any, details: boolean) {
    let array = ['projets', configuration.id];
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

    this.router.navigate(['projets', 'new']);
  }
}
