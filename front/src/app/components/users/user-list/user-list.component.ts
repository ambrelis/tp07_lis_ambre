import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User, UserService } from '../../../services/user.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {
  users: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    // D'abord charger les données
    this.userService.loadUsers();
    
    // Puis s'abonner aux changements
    this.userService.users$.subscribe({
      next: data => {
        console.log('👥 Utilisateurs reçus:', data);
        this.users = data;
      },
      error: err => console.error('❌ Erreur chargement utilisateurs', err)
    });
  }
}
