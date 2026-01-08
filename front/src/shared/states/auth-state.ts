import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { AuthConnexion } from '../actions/auth-action';
import { AuthStateModel } from './auth-state-model';

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    connexion: false,
  },
})
@Injectable()
export class AuthState {
  @Selector()
  static isConnected(state: AuthStateModel) {
    return state.connexion;
  }

  @Action(AuthConnexion)
  add(
    { getState, patchState }: StateContext<AuthStateModel>,
    { payload }: AuthConnexion
  ) {
    //const state = getState();
    patchState({
      connexion: payload.connexion,
    });
  }
}
