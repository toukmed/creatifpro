import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Resource } from '../models/resource';

@Injectable({
  providedIn: 'root',
})
export class ResourceService<T extends Resource> {
  private readonly url = 'http://localhost:8080';

  constructor(private httpClient: HttpClient) {}

  login(item: T, endpoint: string): Observable<any> {
    return this.httpClient.post<T>(`${this.url}/${endpoint}`, item);
  }

  register(item: T, endpoint: string): Observable<any> {
    return this.httpClient.post<T>(`${this.url}/${endpoint}`, item);
  }

  public create(item: T, endpoint: string): Observable<T> {
    return this.httpClient.post<T>(`${this.url}/${endpoint}/create`, item);
  }

  public update(item: T, endpoint: string): Observable<T> {
    return this.httpClient.put<T>(`${this.url}/${endpoint}/update`, item);
  }

  public getById(
    id: number,
    endpoint: string,
    pathParam?: string
  ): Observable<any> {
    const url = `${this.url}/${endpoint}/${id}`;

    const finalUrl = pathParam ? `${url}?jourPointage=${pathParam}` : url;

    return this.httpClient.get(finalUrl);
  }

  public isExistBy(
    endpoint: string,
    idPointage: string,
    jourPointage: string
  ): Observable<any> {
    const url = `${this.url}/${endpoint}/isExistBy`;
    const finalUrl =
      idPointage && jourPointage
        ? `${url}?idPointage=${idPointage}&jourPointage=${jourPointage}`
        : url;
    return this.httpClient.get(finalUrl);
  }

  public list(body: any, endpoint: string): Observable<any> {
    return this.httpClient.post(`${this.url}/${endpoint}`, body);
  }

  public addList(body: any, endpoint: string): Observable<any> {
    return this.httpClient.post(`${this.url}/${endpoint}`, body);
  }

  public delete(id: number, endpoint: string, pathParam?: string) {
    const url = `${this.url}/${endpoint}/${id}`;
    const finalUrl = pathParam ? `${url}?jourPointage=${pathParam}` : url;
    return this.httpClient.delete(finalUrl);
  }

  public exportToCSV(
    startDate: string,
    endDate: string,
    typeContrat: string,
    endpoint: string,
    idPointage?: number
  ): Observable<Blob> {
    const url = `${this.url}/${endpoint}/export/csv?typeContrat=${typeContrat}&startDate=${startDate}&endDate=${endDate}`;
    const finalUrl = idPointage ? `${url}&idPointage=${idPointage}` : url;

    return this.httpClient.get(finalUrl, {
      responseType: 'blob',
    });
  }

  public getStats(id: number, endpoint: string) {
    return this.httpClient.get(
      `${this.url}/${endpoint}/stats?pointageId=${id}`
    );
  }
}
