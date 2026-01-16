import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TaskService } from '../services/task';
import { Status } from '../services/status';
import { TaskM } from '../models/task';
import { StatusM } from '../models/status';

@Component({
  selector: 'app-new-event',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './new-event.html',
  styleUrl: './new-event.scss',
})
export class NewEvent implements OnInit {

  taskId: number | null = null;
  isEditMode: boolean = false;
  statuses: StatusM[] = [];
  pageTitle: string = 'Nouvelle tâche';

  dueDateControl = new FormControl("", Validators.required);
  statusControl = new FormControl("", Validators.required);
  fullDescriptionControl = new FormControl("", Validators.required);
  shortDescriptionControl = new FormControl("", Validators.required);

  form = new FormGroup({
    dueDate: this.dueDateControl,
    status: this.statusControl,
    fullDescription: this.fullDescriptionControl,
    shortDescription: this.shortDescriptionControl
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private statusService: Status
  ) {}

  ngOnInit() {
    // Load statuses for the dropdown
    this.loadStatuses();

    // Check if we're in edit mode
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.taskId = +params['id'];
        this.isEditMode = true;
        this.pageTitle = 'Modifier la tâche';
        this.loadTask(this.taskId);
      }
    });
  }

  loadStatuses() {
    this.statusService.getStatuses().subscribe({
      next: (data: any) => {
        if (Array.isArray(data)) {
          this.statuses = data;
        } else if (data && Array.isArray(data.data)) {
          this.statuses = data.data;
        } else if (data && typeof data === 'object') {
          this.statuses = Object.values(data);
        } else {
          this.statuses = [];
        }
        console.log('Statuses loaded:', this.statuses);
      },
      error: (err) => console.error('Error loading statuses:', err)
    });
  }

  loadTask(id: number) {
    this.taskService.getTask(id).subscribe({
      next: (task: TaskM) => {
        console.log('Task loaded for editing:', task);
        
        // Pre-fill the form with task data
        this.form.patchValue({
          dueDate: task.execution_datetime ? this.formatDateForInput(task.execution_datetime) : '',
          status: task.status_id?.toString() || '',
          fullDescription: task.description || '',
          shortDescription: task.short_description || ''
        });
      },
      error: (err) => {
        console.error('Error loading task:', err);
        alert('Erreur lors du chargement de la tâche');
        this.router.navigate(['/']);
      }
    });
  }

  formatDateForInput(dateString: string): string {
    // Convert date to format YYYY-MM-DDTHH:mm for datetime-local input
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  submit() {
    console.log('Form valid:', this.form.valid);
    
    if (this.form.valid) {
      const formData = {
        description: this.form.value.shortDescription,
        full_description: this.form.value.fullDescription,
        status_id: +this.form.value.status!,
        execution_datetime: this.form.value.dueDate
      };

      console.log('Form data:', formData);

      if (this.isEditMode && this.taskId) {
        // Update existing task
        this.taskService.updateTask(this.taskId, formData).subscribe({
          next: (response) => {
            console.log('Task updated:', response);
            alert('Tâche modifiée avec succès');
            this.router.navigate(['/']);
          },
          error: (err) => {
            console.error('Error updating task:', err);
            alert('Erreur lors de la modification de la tâche');
          }
        });
      } else {
        // Create new task
        this.taskService.createTask(formData).subscribe({
          next: (response) => {
            console.log('Task created:', response);
            alert('Tâche créée avec succès');
            this.router.navigate(['/']);
          },
          error: (err) => {
            console.error('Error creating task:', err);
            alert('Erreur lors de la création de la tâche');
          }
        });
      }
    } else {
      alert('Veuillez remplir tous les champs requis');
    }
  }

  cancel() {
    this.router.navigate(['/']);
  }
}