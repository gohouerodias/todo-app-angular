import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-new-event',
  imports: [  FormsModule, ReactiveFormsModule],
  templateUrl: './new-event.html',
  styleUrl: './new-event.scss',
})
export class NewEvent {

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

  submit() {
    console.log('this.form.valid', this.form.valid);
    if (this.form.valid) {
      console.log('Submitting form', this.form.value);
      // Here you can handle the form submission, e.g., send data to a server to an api endpoint
    }
  }
}
