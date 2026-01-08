import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngxs/store';
import { FavoritesState } from '../../shared/states/favorites-state';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header implements OnInit {
  favoritesCount = 0;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.select(FavoritesState.getFavoritesCount).subscribe(count => {
      this.favoritesCount = count;
    });
  }
}
