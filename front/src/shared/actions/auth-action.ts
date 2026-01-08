import { Auth } from '../models/auth';

export class AuthConnexion {
  static readonly type = '[Auth] Connexion';

  constructor(public payload: Auth) {}
}

export class LoginSuccess {
  static readonly type = '[Auth] Login Success';

  constructor(public payload: { connexion: boolean }) {}
}

export class Logout {
  static readonly type = '[Auth] Logout';
}

export class Register {
  static readonly type = '[Auth] Register';

  constructor(public payload: any) {}
}
