import { Location } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {
  FormControl,
  FormControlOptions,
  FormGroup,
  ValidatorFn,
} from '@angular/forms';
import { ActivatedRoute, ResolveStart, Router } from '@angular/router';
import { ResourceService } from '../services/resource.service';
import { FieldType, Resource } from '../models/resource';
import { Employe, TypeContrat, employeEditFields } from '../models/employe';
import { Projet, projetEditFields } from '../models/projet';
import { Pointage, pointageEditFields } from '../models/pointage';
import { MatTabGroup } from '@angular/material/tabs';
import { areDeeplyEqual } from '../utils/utils';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';

export class Field {
  name: string;
  displayName: string;
  type: FieldType;
  validators: ValidatorFn | ValidatorFn[] | FormControlOptions | null;
  stringValidator: string;
  request: string;
  dynamicRequestParam: string;
  staticRequestParam: Object;
  requestResult: string;
  mappedName: string;
  disabled: boolean;
  list: any[];
  staticValues: string[];
  idCustomizer: string;
}

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrl: './edit-page.component.scss',
})
export class EditPageComponent implements OnInit {
  protected readonly FieldType = FieldType;
  formGroup = new FormGroup({});
  @Input()
  isReadOnly = false;
  @Input()
  entity: any;
  @ViewChild('tabs') tabGroup: MatTabGroup;
  isAddition = false;
  isTheSame = true;
  entityName: string = '';
  loading = true;
  fields: Field[] = [];
  initValue: any = {};
  typeContratEnum = TypeContrat;
  typeContratKeys = Object.keys(this.typeContratEnum);
  routesItem = ['employes', 'pointages', 'projets'];
  conf: any = {
    libelles: {
      employes: "de l'employé",
      pointages: 'du pointage',
      projets: 'du projet',
    },
    fields: {
      employes: employeEditFields,
      projets: projetEditFields,
      pointages: pointageEditFields,
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
    private service: ResourceService<Resource>,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.entityName =
      this.routesItem.find((item) =>
        this.route.snapshot.url.map((u) => u.path).includes(item)
      ) || '';

    const id = this.route.snapshot.paramMap.get('id');
    const entityRequest = this.conf.requests.get[this.entityName];
    this.isAddition = id === 'new';
    if (!this.isAddition) {
      this.service.getById(parseInt(id ?? ''), entityRequest).subscribe(
        (res) => {
          console.log(res);
          this.entity = res;
          this.initFieldsAndEntity();
          this.loading = false;
        },
        (err) => console.log(err.message)
      );
    } else {
      this.loading = false;
      this.entity = this.getEntityFromName();
      this.initFieldsAndEntity();
    }
  }

  initFieldsAndEntity() {
    this.fields = this.conf.fields[this.entityName];
    console.log(this.fields);
    this.initForm();
  }

  getEntityFromName(): any {
    switch (this.entityName) {
      case 'projets':
        return new Projet();
      case 'pointages':
        return new Pointage();
      case 'employes':
        return new Employe();
    }
  }

  manageBack() {
    this.router.lastSuccessfulNavigation?.previousNavigation
      ? this.location.back()
      : this.router.navigate(['/' + this.entityName]);
  }

  initForm() {
    this.fields?.forEach((field) => {
      this.formGroup.addControl(
        field.name,
        new FormControl(this.entity[field.name], field.validators)
      );
    });
    if (this.isReadOnly) this.formGroup.disable();
    this.initValue = structuredClone(this.prepareEntity(this.formGroup.value));

    this.formGroup.valueChanges.subscribe((v) => {
      const current = this.prepareEntity(v);
      Object.values(current).forEach((x) => (Array.isArray(x) ? x.sort() : x));
      Object.values(this.initValue).forEach((x) =>
        Array.isArray(x) ? x.sort() : x
      );
      this.isTheSame = areDeeplyEqual(this.initValue, current);
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
          " de l'employé " +
          (this.entity?.employe?.nom || '') +
          ' ' +
          (this.entity?.employe?.prenom || '');
  }

  prepareEntity(object: any): Resource {
    const strings = this.fields?.filter((f) => f.type === FieldType.string);

    // We use getRawValue here because we want all value even of field is disabled
    let res: any = structuredClone(object);
    strings?.forEach((e) => {
      res[e.name] = res[e.name] === '' ? null : res[e.name];
      if (!this.isAddition) {
        res['id'] = this.entity.id;
      }
    });
    return res;
  }

  validate() {
    if (this.isAddition) {
      this.save();
      return;
    }
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '1000px',
      disableClose: true,
      data: 'Etes vous sur de vouloir appliquer les nouvelles modifications ?',
    });
    dialogRef.afterClosed().subscribe((value) => value && this.save());
  }

  save() {
    const data = this.prepareEntity(this.formGroup.value);
    !this.isReadOnly && this.isAddition
      ? this.service
          .create(data, this.conf.requests.create[this.entityName])
          .subscribe(
            () => {
              this.requestSuccess();
            },
            (err) =>
              this.toastr.error('Erreur lors de la mise à jour', 'Erreur')
          )
      : this.service
          .update(data, this.conf.requests.create[this.entityName])
          .subscribe(
            () => {
              this.requestSuccess();
            },
            (err) =>
              this.toastr.error('Erreur lors de la mise à jour', 'Erreur')
          );
  }

  requestSuccess() {
    this.toastr.success('Mise à jour réussie', 'Succès');
    // Used to pass the guard
    this.isTheSame = true;
    this.router.navigate([this.entityName]);
  }

  entitySelected(fieldName: string) {
    // Reset linked fields recursively
    this.resetLinkedFields(fieldName);
  }

  resetLinkedFields(fieldName: string) {
    const linkedFields = this.fields.filter(
      (f) => f.dynamicRequestParam === fieldName
    );
    linkedFields.forEach((lf) => {
      this.manageDisabled(lf);
      this.formGroup.get(lf.name)?.reset();
      if (lf.type === FieldType.multipleEntity) {
        this.entity[lf.name] = [];
      }
      lf.list = [];
      this.resetLinkedFields(lf.name);
    });
  }

  manageDisabled(field: Field) {
    if (field.disabled || this.needToBeDisabled(field)) {
      this.formGroup.get(field.name)?.disable();
    }
  }

  needToBeDisabled(field: Field): boolean {
    // If no parent, no need to disable
    if (!field.dynamicRequestParam) {
      return false;
    }
    const parentValue = this.formGroup.get(field.dynamicRequestParam)?.value;
    return !parentValue;
  }
}
