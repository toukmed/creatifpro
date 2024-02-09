import { Component, OnInit } from '@angular/core';
import { columns } from './pointage.variables';
import { ResourceService } from '../../services/resource.service';
import { Pointage } from '../../models/pointage';

@Component({
  selector: 'app-pointage',
  templateUrl: './pointage.component.html',
  styleUrl: './pointage.component.scss',
})
export class PointageComponent implements OnInit {
  readonly columns = columns;

  pointages: Pointage[];

  constructor(private service: ResourceService<Pointage>) {}

  ngOnInit(): void {
    this.service.list({ libelle: '' }, 'pointages').subscribe((resp) => {
      console.log(resp.content);
      this.pointages = resp.content;
    });
  }
}
