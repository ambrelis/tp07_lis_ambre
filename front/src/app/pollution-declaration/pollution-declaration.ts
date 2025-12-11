import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Pollution } from '../services/pollution.service';
import { UserService } from '../services/user.service';
import { User } from '../services/user.service';

@Component({
  selector: 'app-pollution-declaration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pollution-declaration.html',
  styleUrls: ['./pollution-declaration.css']
})
export class PollutionDeclaration {

  formGroup = new FormGroup({
    titre: new FormControl('', Validators.required),
    type_pollution: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    date_observation: new FormControl('', Validators.required),
    lieu: new FormControl('', Validators.required),
    latitude: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[-+]?\d+(\.\d+)?$/),
      latitudeValidator
    ]),
    longitude: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[-+]?\d+(\.\d+)?$/),
      longitudeValidator
    ]),
    photo_url: new FormControl(''),
  });

  @Output() formValide = new EventEmitter<Pollution>();
  users: User[] = [];
  constructor(private userService: UserService) {}
  
  ngOnInit() {
    // récupère la liste des utilisateurs
    this.userService.users$.subscribe(users => {
      this.users = users;
    });
  }
  isInvalidAndTouchedOrDirty(formControl: FormControl) {
    return formControl.invalid && (formControl.touched || formControl.dirty);
  }

  selectedUser = new FormControl('', Validators.required);

  onSubmit() {
  if (this.formGroup.valid && this.selectedUser.value) {
    const pollutionData: Pollution = {
      titre: this.formGroup.value.titre!,
      type_pollution: this.formGroup.value.type_pollution || '',
      description: this.formGroup.value.description || '',
      date_observation: this.formGroup.value.date_observation || '',
      lieu: this.formGroup.value.lieu || '',
      latitude: Number(this.formGroup.value.latitude),
      longitude: Number(this.formGroup.value.longitude),
      photo_url: this.formGroup.value.photo_url || '',
      user_id: Number(this.selectedUser.value)
    };
    this.formValide.emit(pollutionData);
  } else {
    this.formGroup.markAllAsTouched();
    this.selectedUser.markAsTouched();
  }
  }



}

function latitudeValidator(control: AbstractControl): ValidationErrors | null {
  const value = parseFloat(control.value);
  if (isNaN(value) || value < -90 || value > 90) {
    return { latitudeInvalid: true };
  }
  return null;
}

function longitudeValidator(control: AbstractControl): ValidationErrors | null {
  const value = parseFloat(control.value);
  if (isNaN(value) || value < -180 || value > 180) {
    return { longitudeInvalid: true };
  }
  return null;
}
