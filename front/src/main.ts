import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { environment } from './environments/environment';
import { NgxsModule } from '@ngxs/store';
import { withNgxsStoragePlugin } from '@ngxs/storage-plugin';
import { Login } from './app/login/login';    
import { AuthState } from './shared/states/auth-state';
import { FavoritesState } from './shared/states/favorites-state';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    importProvidersFrom(
      NgxsModule.forRoot([AuthState, FavoritesState], {
        developmentMode: !environment.production
      })
    ),
    withNgxsStoragePlugin({
      keys: ['favorites']
    }),
    provideRouter(routes)
  ]
}).catch(err => console.error(err));
