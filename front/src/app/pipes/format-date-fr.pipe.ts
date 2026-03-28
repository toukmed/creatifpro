import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDateFr'
})
export class FormatDateFrPipe implements PipeTransform {
  transform(value: any): string {
    if (!value) return '';
    const date = new Date(value);
    if (isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  }
}

