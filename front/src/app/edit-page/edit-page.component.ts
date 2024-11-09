import { Location } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourceService } from '../services/resource.service';
import { Resource } from '../models/resource';
import { formatToShortFormatDate } from '../utils/date-utils';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrl: './edit-page.component.scss',
})
export class EditPageComponent implements OnInit {
  readonly formatToShortFormatDate = formatToShortFormatDate;
  @Input()
  isReadOnly = false;
  entity: any;
  id: string;
  @ViewChild('tabs') tabGroup: MatTabGroup;
  isAddition = false;

  entityName: string = '';
  routesItem = ['employes', 'pointages', 'projets'];

  conf: any = {
    libelles: {
      employes: "de l'employé",
      pointages: 'du pointage',
      projets: 'du projet',
    },
    fields: {
      //employes: employeEditFields,
      //projets: projetEditFields,
      //pointages: pointageEditFields,
    },
    requests: {
      get: {
        employes: 'employes',
        projets: 'projets',
        pointages: 'pointages',
      },
      create: {
        employes: 'employes',
        projets: 'projets',
        pointages: 'pointages',
      },
      update: {
        employes: 'employes',
        projets: 'projets',
        pointages: 'pointages',
      },
    },
  };

  constructor(
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private service: ResourceService<Resource>
  ) {}

  ngOnInit(): void {
    this.entityName =
      this.routesItem.find((item) =>
        this.route.snapshot.url.map((u) => u.path).includes(item)
      ) || '';

    this.id = this.route.snapshot.paramMap.get('id');
    const entityRequest = this.conf.requests.get[this.entityName];
    this.service
      .getById(parseInt(this.id ?? ''), entityRequest)
      .subscribe((res) => {
        this.entity = res;
      });
  }

  displayHeaderTitle() {
    return this.entityName === 'employes' || this.entityName === 'projets'
      ? this.conf.libelles[this.entityName] +
          ' ' +
          (this.entity?.nom || '') +
          ' ' +
          (this.entity?.prenom || '')
      : this.conf.libelles[this.entityName] +
          ' de   ' +
          (this.entity?.employe?.nom || '') +
          ' ' +
          (this.entity?.employe?.prenom || '');
  }

  manageBack() {
    this.router.lastSuccessfulNavigation?.previousNavigation
      ? this.location.back()
      : this.router.navigate(['/' + this.entityName]);
  }

  validate() {}
}
