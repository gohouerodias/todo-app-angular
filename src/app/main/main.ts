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
  selectedTask: TaskM | null = null;
  showModal: boolean = false;
  
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
      1: 'bg-secondary',
      2: 'bg-primary',
      3: 'bg-success',
    };
    return classes[statusId] || 'bg-secondary';
  }

  editTask(task: TaskM) {
    console.log('Edit task:', task);
    this.router.navigate(['/newEvent', task.id]);
  }

  onRowDoubleClick(task: TaskM) {
    console.log('Double-click on task:', task);
    this.router.navigate(['/newEvent', task.id]);
  }

  confirmDelete(id: number | undefined) {
    if (id && confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      this.taskService.deleteTask(id).subscribe({
        next: () => {
          this.loadTasks();
          alert('Tâche supprimée avec succès');
        },
        error: (err) => console.error('Erreur lors de la suppression:', err)
      });
    }
  }

  movetoTaskpage() {
    console.log('Navigate to task page');
    this.router.navigate(['/newEvent']);
  }



  trackByTaskId(index: number, task: TaskM): number | undefined {
    return task.id;
  }

  viewTaskDetails(task: TaskM) {
    this.selectedTask = task;
    this.showModal = true;
    console.log('Viewing task details:', task);
  }

  closeModal() {
    this.showModal = false;
    this.selectedTask = null;
  }

}