import { HttpInterceptorFn, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { catchError, throwError, tap } from 'rxjs';
import { AuthState } from '../../shared/states/auth-state';
import { LoginSuccess, Logout } from '../../shared/actions/auth-action';

/**
 * Interceptor HTTP pour l'authentification via cookies HttpOnly
 * 
 * Fonctionnalités:
 * 1. Ajoute withCredentials: true pour envoyer les cookies automatiquement
 * 2. Les cookies HttpOnly sont automatiquement envoyés/reçus par le navigateur
 * 3. Gère les erreurs 401 (Unauthorized) et redirige vers login
 * 4. Gère les erreurs 403 (Forbidden)
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const store = inject(Store);

  // Cloner la requête pour ajouter withCredentials: true
  // Cela permet d'envoyer et recevoir les cookies HttpOnly
  const authReq = req.clone({
    withCredentials: true
  });
  
  // Envoyer la requête et gérer les erreurs
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      
      // Erreur 401 - Token invalide ou expiré
      if (error.status === 401) {
        console.warn('Token invalide ou expiré. Déconnexion...');
        
        // Déconnecter l'utilisateur
        store.dispatch(new Logout());
        
        // Rediriger vers la page de connexion
        router.navigate(['/login'], {
          queryParams: { 
            returnUrl: router.url,
            reason: 'session_expired'
          }
        });
      }

      // Erreur 403 - Permissions insuffisantes
      if (error.status === 403) {
        console.warn('Accès refusé. Permissions insuffisantes.');
      }

      // Propager l'erreur
      return throwError(() => error);
    })
  );
};
