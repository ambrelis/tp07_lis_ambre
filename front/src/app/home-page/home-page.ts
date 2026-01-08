import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PollutionAddComponent } from '../components/pollution-add/pollution-add.component';
import { PollutionEdit } from '../components/pollution-edit/pollution-edit.component';
import { UserAddComponent } from '../components/users/user-add/user-add.component';
import { UserListComponent } from '../components/users/user-list/user-list.component';
import { PollutionDetail } from '../pollution-detail/pollution-detail.component';
import { PollutionListComponent } from '../pollution-list/pollution-list.component';
import { PollutionRecap } from '../pollution-recap/pollution-recap';
import { Pollution, PollutionService } from '../services/pollution.service';

@Component({
  selector: 'app-home-page',
  imports: [CommonModule,FormsModule, ReactiveFormsModule, PollutionRecap, PollutionDetail, PollutionEdit, CommonModule, PollutionAddComponent, PollutionListComponent, UserAddComponent, UserListComponent],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css'
})
export class HomePage {
  afficherFormulaire = false;
  formValide = false;
  donneesRecapitulatif: any;

 // Ajout pour Edit / Detail
  pollutionToEdit: Pollution | null = null;
  pollutionToView: Pollution | null = null;
  constructor(private pollutionService: PollutionService) {}
  toggleFormulaire() {
    this.afficherFormulaire = !this.afficherFormulaire;
  }

  showDetail(pollution: Pollution) {
    this.pollutionToView = pollution;
    this.pollutionToEdit = null;
  }

   ajouterPollution(data: Pollution) {
    console.log('✅ Pollution à ajouter :', data);

    this.pollutionService.addPollution(data).subscribe({
      next: (res) => {
        console.log('Pollution sauvegardée !', res);
        // tu peux éventuellement rafraîchir la liste après ajout
      },
      error: (err) => console.error('Erreur lors de l’ajout', err)
    });
  }

  editPollution(pollution: Pollution) {
    this.pollutionToEdit = pollution;
    this.pollutionToView = null;
  }
  //  onFormSubmit(data: any) {
  //   this.donneesRecapitulatif = data;
  //   this.formValide = true;
  // }
  resetForm() {
  this.formValide = false;
  this.donneesRecapitulatif = null;
  this.afficherFormulaire = false;
  }

}

