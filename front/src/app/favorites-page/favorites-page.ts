import { Component, OnInit } from '@angular/core';
import { PollutionService, Pollution } from '../services/pollution.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngxs/store';
import { FavoritesState } from '../../shared/states/favorites-state';
import { RemoveFavorite, AddFavorite, ClearFavorites } from '../../shared/actions/favorites-action';
import { Observable, combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-favorites-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './favorites-page.html',
  styleUrls: ['./favorites-page.css']
})
export class FavoritesPageComponent implements OnInit {
  favoritePollutions$!: Observable<Pollution[]>;
  favoritesCount$!: Observable<number>;

  constructor(
    private pollutionService: PollutionService,
    private store: Store
  ) {}

  ngOnInit(): void {
    const favoriteIds$ = this.store.select(FavoritesState.getFavoriteIds);
    const allPollutions$ = this.pollutionService.getPollutions();

    this.favoritePollutions$ = combineLatest([favoriteIds$, allPollutions$]).pipe(
      map(([ids, pollutions]) => {
        const favIds = Array.isArray(ids) ? ids : [];
        return pollutions.filter(p => p.id && favIds.includes(p.id.toString()));
      })
    );

    this.favoritesCount$ = this.store.select(FavoritesState.getFavoritesCount);
  }

  toggleFav(id: number): void {
    const isFav = this.store.selectSnapshot(FavoritesState.isFavorite)(id.toString());
    if (isFav) {
      this.store.dispatch(new RemoveFavorite(id.toString()));
    } else {
      this.store.dispatch(new AddFavorite(id.toString()));
    }
  }

  clearAllFavorites(): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer tous vos favoris ?')) {
      this.store.dispatch(new ClearFavorites());
    }
  }

  isFavorite(id: number): boolean {
    return this.store.selectSnapshot(FavoritesState.isFavorite)(id.toString());
  }
}
