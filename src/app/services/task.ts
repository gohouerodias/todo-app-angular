import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TaskM } from '../models/task';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'http://localhost:8000/api/tasks';
  constructor(private http: HttpClient) { }

  // GET /api/tasks
  getTasks(): Observable<TaskM[]> {
    return this.http.get<TaskM[]>(this.apiUrl);
  }

  // GET /api/tasks/{task}
  getTask(id: number): Observable<TaskM> {
    return this.http.get<TaskM>(`${this.apiUrl}/${id}`);
  }

  // POST /api/tasks
  createTask(task: TaskM): Observable<TaskM> {
    return this.http.post<TaskM>(this.apiUrl, task);
  }

  // PUT/PATCH /api/tasks/{task}
  updateTask(id: number, task: TaskM): Observable<TaskM> {
    return this.http.put<TaskM>(`${this.apiUrl}/${id}`, task);
  }

  // DELETE /api/tasks/{task}
  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
