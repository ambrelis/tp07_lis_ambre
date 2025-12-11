import { Component } from '@angular/core';
import { PollutionService,Pollution } from '../../services/pollution.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PollutionDeclaration } from '../../pollution-declaration/pollution-declaration';
@Component({
  selector: 'app-pollution-add',
  imports: [CommonModule, FormsModule, PollutionDeclaration],
  templateUrl: './pollution-add.component.html',
  styleUrl: './pollution-add.component.css'
})

export class PollutionAddComponent {
 
constructor(private pollutionService: PollutionService) {}

ajouterPollution(pollution: Pollution ) {
this.pollutionService.addPollution(pollution).subscribe({
      next: (data) => console.log('Pollution ajoutée :', data),
      error: (err) => console.error('Erreur ajout pollution', err)
    });
}
}