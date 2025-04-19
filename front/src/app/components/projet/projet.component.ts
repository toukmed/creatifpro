import { Component, OnInit } from '@angular/core';
import { columns } from './projet.variables';
import { Projet } from '../../models/projet';
import { ResourceService } from '../../services/resource.service';
import { Router } from '@angular/router';
import { AddEditProjetComponent } from './add-edit-projet/add-edit-projet.component';
import { DialogConfig } from '@angular/cdk/dialog';
import { dialogConfig } from '../../utils/utils';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-projet',
  templateUrl: './projet.component.html',
  styleUrl: './projet.component.scss',
})
export class ProjetComponent implements OnInit {
  readonly columns = columns;
  readonly dialogConfig = dialogConfig;

  projets: Projet[];

  constructor(
    private service: ResourceService<Projet>,
    private router: Router,
    private dialog: MatDialog
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
    const dialogConfig = this.dialogConfig({}, '1000px', '700px');
    this.dialog
      .open(AddEditProjetComponent, dialogConfig)
      .afterClosed()
      .subscribe((resp) => {});
  }
}
