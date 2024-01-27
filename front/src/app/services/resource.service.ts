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
    return this.httpClient.post<T>(`${this.url}/${endpoint}`, item);
  }

  public update(item: T, endpoint: string): Observable<T> {
    return this.httpClient.put<T>(`${this.url}/${endpoint}/${item.id}`, item);
  }

  getById(id: number, endpoint: string): Observable<any> {
    return this.httpClient.get(`${this.url}/${endpoint}/${id}`);
  }

  list(queryOptions: any, endpoint: string): Observable<any> {
    return this.httpClient.get(
      `${this.url}/${endpoint}?${queryOptions.toQueryString()}`
    );
  }

  delete(id: number, endpoint: string) {
    return this.httpClient.delete(`${this.url}/${endpoint}/${id}`);
  }
}
