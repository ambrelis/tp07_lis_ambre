import { Injectable, inject } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { AuthConnexion, Login, LoginSuccess, Logout, Register } from '../actions/auth-action';
import { AuthStateModel } from './auth-state-model';
import { AuthService } from '../../app/services/auth.service';
import { tap, catchError } from 'rxjs';
import { Router } from '@angular/router';

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    connexion: false,
    token: null,
    user: null
  },
})
@Injectable()
export class AuthState {
  private authService = inject(AuthService);
  private router = inject(Router);

  @Selector()
  static isConnected(state: AuthStateModel) {
    return state.connexion;
  }

  @Selector()
  static getToken(state: AuthStateModel) {
    return state.token;
  }

  @Selector()
  static getUser(state: AuthStateModel) {
    return state.user;
  }

  @Action(Login)
  login(ctx: StateContext<AuthStateModel>, action: Login) {
    return this.authService.login(action.payload).pipe(
      tap((response) => {
        console.log('✅ Login response:', response);
        
        ctx.dispatch(new LoginSuccess({
          token: response.token,
          user: response.user
        }));
        
        this.router.navigate(['/pollutions']);
      }),
      catchError((error) => {
        console.error('❌ Erreur login:', error);
        throw error;
      })
    );
  }

  @Action(LoginSuccess)
  loginSuccess(ctx: StateContext<AuthStateModel>, action: LoginSuccess) {
    console.log('✅ LoginSuccess - Mise à jour du state:', action.payload);
    
    ctx.patchState({
      connexion: true,
      token: action.payload.token,
      user: action.payload.user
    });
  }

  @Action(Logout)
  logout(ctx: StateContext<AuthStateModel>) {
    return this.authService.logout().pipe(
      tap(() => {
        console.log('✅ Déconnexion réussie');
        
        ctx.patchState({
          connexion: false,
          token: null,
          user: null
        });
        
        this.router.navigate(['/login']);
      }),
      catchError((error) => {
        console.warn('⚠️ Erreur lors de la déconnexion:', error);
        
        // Même en cas d'erreur, nettoyer le state
        ctx.patchState({
          connexion: false,
          token: null,
          user: null
        });
        
        this.router.navigate(['/login']);
        throw error;
      })
    );
  }

  @Action(Register)
  register(ctx: StateContext<AuthStateModel>, action: Register) {
    return this.authService.register(action.payload).pipe(
      tap((response) => {
        console.log('✅ Register response:', response);
        
        ctx.dispatch(new LoginSuccess({
          token: response.token,
          user: response.user
        }));
        
        this.router.navigate(['/pollutions']);
      }),
      catchError((error) => {
        console.error('❌ Erreur inscription:', error);
        throw error;
      })
    );
  }

  @Action(AuthConnexion)
  connexion(
    { patchState }: StateContext<AuthStateModel>,
    { payload }: AuthConnexion
  ) {
    patchState({
      connexion: payload.connexion,
    });
  }
}
