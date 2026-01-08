import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { AddFavorite, RemoveFavorite, ClearFavorites } from '../actions/favorites-action';
import { FavoritesStateModel } from './favorites-state-model';
import { Favorite } from '../models/favorite';

@State<FavoritesStateModel>({
  name: 'favorites',
  defaults: {
    favorites: [],
  },
})
@Injectable()
export class FavoritesState {
  @Selector()
  static getFavorites(state: FavoritesStateModel): Favorite[] {
    return state?.favorites ?? [];
  }

  @Selector()
  static getFavoriteIds(state: FavoritesStateModel): string[] {
    return state?.favorites?.map(f => f.pollutionId) ?? [];
  }

  @Selector()
  static getFavoritesCount(state: FavoritesStateModel): number {
    return state?.favorites?.length ?? 0;
  }

  @Selector()
  static isFavorite(state: FavoritesStateModel) {
    return (pollutionId: string) => {
      return state?.favorites?.some(f => f.pollutionId === pollutionId) ?? false;
    };
  }

  @Action(AddFavorite)
  addFavorite(
    { getState, patchState }: StateContext<FavoritesStateModel>,
    { pollutionId }: AddFavorite
  ) {
    const state = getState();
    const currentFavorites = state?.favorites ?? [];
    const exists = currentFavorites.some(f => f.pollutionId === pollutionId);
    
    if (!exists) {
      const newFavorites = [...currentFavorites, {
        pollutionId: pollutionId,
        addedAt: new Date()
      }];
      patchState({
        favorites: newFavorites
      });
    }
  }

  @Action(RemoveFavorite)
  removeFavorite(
    { getState, patchState }: StateContext<FavoritesStateModel>,
    { pollutionId }: RemoveFavorite
  ) {
    const state = getState();
    const currentFavorites = state?.favorites ?? [];
    const newFavorites = currentFavorites.filter(f => f.pollutionId !== pollutionId);
    patchState({
      favorites: newFavorites
    });
  }

  @Action(ClearFavorites)
  clearFavorites({ patchState }: StateContext<FavoritesStateModel>) {
    patchState({
      favorites: []
    });
  }
}
