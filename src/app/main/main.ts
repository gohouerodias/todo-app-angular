import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TaskService } from '../services/task';
import { Status } from '../services/status';
import { TaskM } from '../models/task';
import { StatusM } from '../models/status';

@Component({
  selector: 'app-main',
  imports: [CommonModule],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main implements OnInit {

  tasks: TaskM[] = [];
  statuses: StatusM[] = [];
  statusCache: Map<number, string> = new Map();
  
  constructor(
    private taskService: TaskService,
    private statusService: Status,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    // Load statuses first, then load tasks once statuses are ready
    this.loadStatuses();
  }

  loadTasks() {
    this.taskService.getTasks().subscribe({
      next: (data: any) => {
        console.log('Raw tasks data:', data);
        console.log('Tasks data type:', typeof data, 'Is array:', Array.isArray(data));
        
        // Handle different response formats
        if (Array.isArray(data)) {
          this.tasks = data;
        } else if (data && Array.isArray(data.data)) {
          this.tasks = data.data;
        } else if (data && typeof data === 'object') {
          this.tasks = Object.values(data);
        } else {
          this.tasks = [];
        }
        
        console.log('Tasks loaded:', this.tasks);
        console.log('Tasks length:', this.tasks.length);
        
        // Force change detection
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading tasks:', err)
    });
  }

  loadStatuses() {
    this.statusService.getStatuses().subscribe({
      next: (data: any) => {
        console.log('Raw status data:', data);
        console.log('Is array:', Array.isArray(data));
        
        // Handle different response formats
        if (Array.isArray(data)) {
          this.statuses = data;
        } else if (data && Array.isArray(data.data)) {
          // If API returns { data: [...] }
          this.statuses = data.data;
        } else if (data && typeof data === 'object') {
          // If API returns an object, try to convert values to array
          this.statuses = Object.values(data);
        } else {
          this.statuses = [];
        }
        
        // Populate the status cache
        this.statuses.forEach(status => {
          if (status.id !== undefined) {
            this.statusCache.set(status.id, status.name);
          }
        });
        console.log('Statuses loaded:', this.statuses);
        console.log('Status cache:', this.statusCache);
        
        // Load tasks after statuses are ready
        this.loadTasks();
      },
      error: (err) => console.error('Error loading statuses:', err)
    });
  }

  getStatusName(statusId: number): string {
    if (this.statusCache.has(statusId)) {
      return this.statusCache.get(statusId) || 'Unknown';
    }
    
    // Fallback to find in loaded statuses array
    if (Array.isArray(this.statuses)) {
      const status = this.statuses.find(s => s.id === statusId);
      if (status) {
        this.statusCache.set(statusId, status.name);
        return status.name;
      }
    }
    
    return 'Unknown';
  }

  getStatusClass(statusId: number): string {
    const classes: { [key: number]: string } = {
      1: 'bg-success',
      2: 'bg-primary',
      3: 'bg-secondary',
      4: 'bg-warning',
    };
    return classes[statusId] || 'bg-secondary';
  }

  editTask(task: TaskM) {
    console.log('Edit task:', task);
    // TODO: Implement edit functionality
    this.router.navigate(['/editTask', task.id]);
  }

  confirmDelete(id: number | undefined) {
    if (id && confirm('Вы уверены, что хотите удалить эту задачу?')) {
      this.taskService.deleteTask(id).subscribe({
        next: () => {
          this.loadTasks();
          alert('Задача успешно удалена');
        },
        error: (err) => console.error('Ошибка при удалении:', err)
      });
    }
  }

  movetoTaskpage() {
    console.log('Navigate to task page');
    this.router.navigate(['/newEvent']);
  }

  openCreateModal() {
    console.log('Open create modal');
    // TODO: Implement modal opening logic
  }

  trackByTaskId(index: number, task: TaskM): number | undefined {
    return task.id;
  }

}