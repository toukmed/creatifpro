import { Component, OnInit } from '@angular/core';
import { columns } from './pointage.variables';
import { ResourceService } from '../../services/resource.service';
import { Pointage } from '../../models/pointage';
import { Router } from '@angular/router';
import { getStartAndEndOfWeek } from '../../utils/utils';

const { weekStart, weekEnd } = getStartAndEndOfWeek(new Date());

@Component({
  selector: 'app-pointage',
  templateUrl: './pointage.component.html',
  styleUrl: './pointage.component.scss',
})
export class PointageComponent implements OnInit {
  readonly columns = columns;

  pointages: Pointage[];

  constructor(
    private service: ResourceService<Pointage>,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.service
      .list(
        { libelle: '', weekStartDate: weekStart, weekEndDate: weekEnd },
        'pointages'
      )
      .subscribe((resp) => {
        this.pointages = resp.content;
      });
  }

  searchPointages(args: any) {
    this.service.list(args, 'pointages').subscribe((resp) => {
      this.pointages = resp.content;
    });
  }
  edit(configuration: any, details: boolean) {
    let array = ['pointages', configuration.id];
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

    this.router.navigate(['pointages', 'new']);
  }
}
