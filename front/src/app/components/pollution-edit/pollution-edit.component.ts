import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pollution, PollutionService } from '../../services/pollution.service';

@Component({
  selector: 'app-pollution-edit',
  imports: [CommonModule, FormsModule],
  templateUrl: './pollution-edit.component.html',
  styleUrl: './pollution-edit.component.css'
})
export class PollutionEdit {
  @Input() pollution: Pollution | null = null;

  constructor(private pollutionService: PollutionService) {}

  saveChanges() {
    if (this.pollution?.id != null) {
      this.pollutionService.updatePollution(this.pollution.id, this.pollution)
          .subscribe({
            next: data => console.log('Pollution modifiée :', data),
            error: err => console.error('Erreur PUT :', err)
          });
    } else {
      console.error('Id de pollution manquant !');
    }
  }
}
