import { Component, OnInit } from '@angular/core';
import { columns } from './projet.variables';
import { Projet } from '../../models/projet';
import { ResourceService } from '../../services/resource.service';
import { Router } from '@angular/router';
<<<<<<< HEAD
import { AddEditProjetComponent } from './add-edit-projet/add-edit-projet.component';
import { DialogConfig } from '@angular/cdk/dialog';
import { dialogConfig } from '../../utils/utils';
import { MatDialog } from '@angular/material/dialog';
=======
import { MatDialog } from '@angular/material/dialog';
import { dialogConfig } from '../../utils/utils';
import { AddProjetComponent } from './add-projet/add-projet.component';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { EditProjetComponent } from './edit-projet/edit-projet.component';
>>>>>>> b32abcf... config + upgrade java version to 21 + some code

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
<<<<<<< HEAD
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.service.list({ libelle: '' }, 'projets').subscribe((resp) => {
=======
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.list({ libelle: '' });
  }

  list(args: any) {
    this.service.list(args, 'projets').subscribe((resp) => {
>>>>>>> b32abcf... config + upgrade java version to 21 + some code
      this.projets = resp.content;
    });
  }

  searchProjets(args: any) {
    this.service.list(args, 'projets').subscribe((resp) => {
      this.projets = resp.content;
    });
  }

  edit(configuration: any, details: boolean) {
<<<<<<< HEAD
    let array = ['projets', configuration.id];
    if (details) array.push('visu');
    this.router.navigate(array);
  }

  add() {
    const dialogConfig = this.dialogConfig({}, '1000px', '700px');
=======

    this.service.getById(configuration.id, 'projets').subscribe((resp) => {
      this.dialog
        .open(EditProjetComponent, { data: resp })
        .afterClosed()
        .subscribe();
    });
  }

  delete(configuration: any) {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: `Etes vous sur de vouloir supprimer le projet <b>${configuration?.nom}</b>`,
      })
      .afterClosed()
      .subscribe((resp) => {
        if (resp)
          this.service.delete(configuration.id, 'projets').subscribe(() => {
            this.dialog.closeAll();
            this.list({ libelle: '' });
          });
      });
  }

  add() {
    const dialogConfig = this.dialogConfig({}, '600px', '400px');
>>>>>>> b32abcf... config + upgrade java version to 21 + some code
    this.dialog
      .open(AddEditProjetComponent, dialogConfig)
      .afterClosed()
<<<<<<< HEAD
      .subscribe((resp) => {});
=======
      .subscribe((resp) => {
        if (resp)
          this.service.list({ libelle: '' }, 'projets').subscribe((resp) => {
            this.projets = resp.content;
          });
      });
>>>>>>> b32abcf... config + upgrade java version to 21 + some code
  }
}
