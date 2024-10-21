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

  getById(id: number, endpoint: string, pathParam?: string): Observable<any> {
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

  list(body: any, endpoint: string): Observable<any> {
    return this.httpClient.post(`${this.url}/${endpoint}`, body);
  }

  addList(body: any, endpoint: string): Observable<any> {
    return this.httpClient.post(`${this.url}/${endpoint}`, body);
  }

  delete(id: number, endpoint: string) {
    return this.httpClient.delete(`${this.url}/${endpoint}/${id}`);
  }
}
