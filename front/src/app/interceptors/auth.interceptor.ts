import { HttpInterceptorFn, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { catchError, throwError, tap } from 'rxjs';
import { AuthState } from '../../shared/states/auth-state';
import { LoginSuccess, Logout } from '../../shared/actions/auth-action';

/**
 * Interceptor HTTP pour l'authentification JWT
 * 
 * Fonctionnalités:
 * 1. Récupère le token depuis le store NGXS
 * 2. Ajoute le header Authorization: Bearer <token> si token présent
 * 3. Ajoute withCredentials: true pour envoyer/recevoir les cookies HttpOnly
 * 4. Gère les erreurs 401 (Unauthorized) et redirige vers login
 * 5. Gère les erreurs 403 (Forbidden)
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const store = inject(Store);

  // Récupérer le token depuis le state NGXS
  const token = store.selectSnapshot(AuthState.getToken);
  
  // Cloner la requête pour ajouter le token et withCredentials
  let authReq = req.clone({
    withCredentials: true // Envoie les cookies HttpOnly
  });

  // Ajouter le header Authorization si le token existe
  if (token) {
    authReq = authReq.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('🔐 Token ajouté au header Authorization');
  }
  
  // Envoyer la requête et gérer les erreurs
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      
      // Erreur 401 - Token invalide ou expiré
      if (error.status === 401) {
        console.warn('⚠️ Token invalide ou expiré. Déconnexion...');
        
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
