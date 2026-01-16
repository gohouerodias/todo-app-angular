import { Component } from '@angular/core';
import { TaskService } from '../services/task';
import { Status } from '../services/status';
import { TaskM } from '../models/task';
import { StatusM } from '../models/status';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-main',
  imports: [CommonModule],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main {

  tasks: TaskM[] = [];
  statuses: StatusM[] = [];
  constructor(
    private taskService: TaskService,
    private statusService: Status
  ) { }

  ngOnInit() {
    this.loadTasks();
    this.loadStatuses();
  }

  loadTasks() {
    this.taskService.getTasks().subscribe({
      next: (data) => this.tasks = data,
      error: (err) => console.error('Erreur:', err)
    });

    console.log('Tasks loaded:', this.tasks);
  }

  loadStatuses() {
    this.statusService.getStatuses().subscribe({
      next: (data) => this.statuses = data,
      error: (err) => console.error('Erreur:', err)
    });
  }

  deleteTask(id: number) {
    this.taskService.deleteTask(id).subscribe({
      next: () => this.loadTasks(),
      error: (err) => console.error('Erreur:', err)
    });
  }
  getStatusName(statusId: number): string {
    const status = this.statuses.find(s => s.id === statusId);
    return status ? status.name : 'Inconnu';
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
  }

  confirmDelete(id: number | undefined) {
    if (id && confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      this.taskService.deleteTask(id).subscribe({
        next: () => {
          this.loadTasks();
          alert('Tâche supprimée avec succès');
        },
        error: (err) => console.error('Erreur:', err)
      });
    }
  }

  openCreateModal() {
    console.log('Open create modal');
  }

}
