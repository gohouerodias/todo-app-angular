import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { StatusM } from '../models/status';
@Injectable({
  providedIn: 'root',
})
export class Status {
   private apiUrl = 'http://localhost:8000/api/statuses';

  constructor(private http: HttpClient) {}

  // GET /api/statuses
 getStatuses(): Observable<StatusM[]> {
  return this.http.get<any>(this.apiUrl).pipe(
    map(response => Array.isArray(response) ? response : response.data)
  );
}

  // GET /api/statuses/{status}
  getStatus(id: number): Observable<StatusM> {
    return this.http.get<StatusM>(`${this.apiUrl}/${id}`);
  }
}
