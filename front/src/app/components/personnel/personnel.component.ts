import { Component } from '@angular/core';
import { columns } from './personnel.variables';
import { Employe } from '../../models/employe';
import { ResourceService } from '../../services/resource.service';
import { Router } from '@angular/router';
import { dialogConfig } from '../../utils/utils';
import { AddPersonnelComponent } from './add-personnel/add-personnel.component';
import { MatDialog } from '@angular/material/dialog';
import { Projet } from '../../models/projet';
import { EditPersonnelComponent } from './edit-personnel/edit-personnel.component';

@Component({
  selector: 'app-personnel',
  templateUrl: './personnel.component.html',
  styleUrl: './personnel.component.scss',
})
export class PersonnelComponent {
  readonly columns = columns;
  readonly dialogConfig = dialogConfig;

  employes: Employe[];
  projets: Projet[];

  constructor(
    private service: ResourceService<Employe>,
    private projetService: ResourceService<Projet>,
    private router: Router,
    private dialog: MatDialog
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
    this.service.getById(configuration.id, 'employes').subscribe((employe) => {
      this.projetService
        .list({ libelle: '' }, 'projets')
        .subscribe((projets) => {
          const dialogConfig = this.dialogConfig(
            { employe: employe, projets: projets.content },
            '800px',
            '600px'
          );
          this.dialog
            .open(EditPersonnelComponent, dialogConfig)
            .afterClosed()
            .subscribe((resp) => {
              if (resp.success) {
                this.service
                  .list({ libelle: '' }, 'employes')
                  .subscribe((resp) => {
                    this.employes = resp.content;
                  });
              }
            });
        });
    });
    let array = ['employes', configuration.id];
    if (details) array.push('visu');
    this.router.navigate(array);
  }

  add() {
    this.projetService.list({ libelle: '' }, 'projets').subscribe((resp) => {
      const dialogConfig = this.dialogConfig(
        { projets: resp.content },
        '800px',
        '600px'
      );
      this.dialog
        .open(AddPersonnelComponent, dialogConfig)
        .afterClosed()
        .subscribe((resp) => {
          if (resp.success) {
            this.service.list({ libelle: '' }, 'employes').subscribe((resp) => {
              this.employes = resp.content;
            });
          }
        });
    });
  }
}
