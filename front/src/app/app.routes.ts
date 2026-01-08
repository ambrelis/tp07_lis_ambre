import { Routes } from '@angular/router';
import { FavoritesPageComponent } from './favorites-page/favorites-page';
import { HomePage } from './home-page/home-page';

export const routes: Routes = [
  { path: '', redirectTo: '/pollutions', pathMatch: 'full' },

  { path: 'pollutions', component: HomePage },

  { path: 'favoris', component: FavoritesPageComponent },
];
