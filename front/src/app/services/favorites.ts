import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Favorites {
  private storageKey = 'favorites';
  private favorites: number[] = [];
  private favoritesCount$ = new BehaviorSubject<number>(0);

  constructor() {
    const data = localStorage.getItem(this.storageKey);
    this.favorites = data ? JSON.parse(data) : [];
    this.favoritesCount$.next(this.favorites.length);
  }

  getFavorites(): number[] {
    return this.favorites;
  }

  getFavoritesCount() {
    return this.favoritesCount$.asObservable();
  }

  isFavorite(id: number): boolean {
    return this.favorites.includes(id);
  }

  addFavorite(id: number): void {
    if (!this.isFavorite(id)) {
      this.favorites.push(id);
      this.save();
    }
  }

  removeFavorite(id: number): void {
    this.favorites = this.favorites.filter(f => f !== id);
    this.save();
  }

  toggleFavorite(id: number): void {
    this.isFavorite(id) ? this.removeFavorite(id) : this.addFavorite(id);
  }

  private save(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.favorites));
    this.favoritesCount$.next(this.favorites.length); // ⚡ mise à jour du badge
  }
}
