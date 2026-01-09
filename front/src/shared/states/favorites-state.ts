import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap, catchError } from 'rxjs';
import { AddFavorite, RemoveFavorite, ClearFavorites, LoadFavorites } from '../actions/favorites-action';
import { FavoritesService, FavoriteResponse } from '../../app/services/favorites.service';

export interface FavoritesStateModel {
  favorites: FavoriteResponse[];
  loaded: boolean;
}

@State<FavoritesStateModel>({
  name: 'favorites',
  defaults: {
    favorites: [],
    loaded: false
  },
})
@Injectable()
export class FavoritesState {
  constructor(private favoritesService: FavoritesService) {}

  @Selector()
  static getFavorites(state: FavoritesStateModel): FavoriteResponse[] {
    return state.favorites;
  }

  @Selector()
  static getFavoriteIds(state: FavoritesStateModel): number[] {
    return state.favorites.map(f => f.pollution_id);
  }

  @Selector()
  static getFavoritesCount(state: FavoritesStateModel): number {
    return state.favorites.length;
  }

  @Selector()
  static isFavorite(state: FavoritesStateModel) {
    return (pollutionId: number) => {
      return state.favorites.some(f => f.pollution_id === pollutionId);
    };
  }

  @Action(LoadFavorites)
  loadFavorites(ctx: StateContext<FavoritesStateModel>) {
    return this.favoritesService.getUserFavorites().pipe(
      tap((favorites) => {
        console.log('✅ Favoris chargés depuis API:', favorites.length, 'favoris');
        if (favorites.length > 0) {
          console.log('📋 Premier favori (user_id):', favorites[0].user_id);
        }
        ctx.patchState({
          favorites: favorites,
          loaded: true
        });
      }),
      catchError((error) => {
        console.error('❌ Erreur chargement favoris:', error);
        // En cas d'erreur (ex: non authentifié), vider les favoris
        ctx.patchState({
          favorites: [],
          loaded: false
        });
        throw error;
      })
    );
  }

  @Action(AddFavorite)
  addFavorite(ctx: StateContext<FavoritesStateModel>, action: AddFavorite) {
    return this.favoritesService.addFavorite(action.pollutionId).pipe(
      tap((favorite) => {
        console.log('✅ Favori ajouté:', favorite);
        // Recharger tous les favoris pour avoir les données complètes
        ctx.dispatch(new LoadFavorites());
      }),
      catchError((error) => {
        console.error('❌ Erreur ajout favori:', error);
        throw error;
      })
    );
  }

  @Action(RemoveFavorite)
  removeFavorite(ctx: StateContext<FavoritesStateModel>, action: RemoveFavorite) {
    return this.favoritesService.removeFavorite(action.pollutionId).pipe(
      tap(() => {
        console.log('✅ Favori supprimé:', action.pollutionId);
        // Recharger tous les favoris
        ctx.dispatch(new LoadFavorites());
      }),
      catchError((error) => {
        console.error('❌ Erreur suppression favori:', error);
        throw error;
      })
    );
  }

  @Action(ClearFavorites)
  clearFavorites(ctx: StateContext<FavoritesStateModel>) {
    console.log('🗑️  Nettoyage des favoris du state (déconnexion)');
    // ✅ Vider le state sans appeler l'API (car l'utilisateur se déconnecte)
    ctx.patchState({
      favorites: [],
      loaded: false
    });
  }
}
