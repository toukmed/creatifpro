import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Resource } from '../models/resource';

@Injectable({
  providedIn: 'root',
})
export class ResourceService<T extends Resource> {
  //private readonly baseUrl = 'http://72.60.91.94:8080/api';
  private readonly baseUrl = 'http://localhost:8080/api';

  constructor(private httpClient: HttpClient) {}

  login(item: T, endpoint: string): Observable<any> {
    return this.httpClient.post<T>(`${this.baseUrl}/${endpoint}`, item);
  }

  register(item: T, endpoint: string): Observable<any> {
    return this.httpClient.post<T>(`${this.baseUrl}/${endpoint}`, item);
  }

  public create(item: T, endpoint: string): Observable<T> {
    return this.httpClient.post<T>(`${this.baseUrl}/${endpoint}/create`, item);
  }

  public update(item: T, endpoint: string): Observable<T> {
    return this.httpClient.put<T>(`${this.baseUrl}/${endpoint}/update`, item);
  }

  public getById(
    id: number,
    endpoint: string,
    pathParam?: string
  ): Observable<any> {
    const url = `${this.baseUrl}/${endpoint}/${id}`;

    return this.httpClient.get(url);
  }

  public listById(
    id: number,
    endpoint: string,
    body: any,
  ): Observable<any> {
    const url = `${this.baseUrl}/${endpoint}/${id}`;

    return this.httpClient.post(url, body);
  }

  public isExistBy(
    endpoint: string,
    idPointage: string,
  ): Observable<any> {
    const url = `${this.baseUrl}/${endpoint}/isExistBy/${idPointage}`;

    return this.httpClient.get(url);
  }

  public list(body: any, endpoint: string): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/${endpoint}`, body);
  }

  public addList(body: any, endpoint: string): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/${endpoint}`, body);
  }

  public delete(id: number, endpoint: string, pathParam?: string) {
    const url = `${this.baseUrl}/${endpoint}/${id}`;
    return this.httpClient.delete(url);
  }

  public exportToCSV(
    startDate: string,
    endDate: string,
    typeContrat: string,
    endpoint: string,
    idPointage?: number
  ): Observable<Blob> {
    const url = `${this.baseUrl}/${endpoint}/export/csv?typeContrat=${typeContrat}&startDate=${startDate}&endDate=${endDate}`;
    const finalUrl = idPointage ? `${url}&idPointage=${idPointage}` : url;

    return this.httpClient.get(finalUrl, {
      responseType: 'blob',
    });
  }

  public getStats(id: number, endpoint: string) {
    return this.httpClient.get(
      `${this.baseUrl}/${endpoint}/stats?pointageId=${id}`
    );
  }
}
