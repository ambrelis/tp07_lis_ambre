import { Component,inject,signal } from '@angular/core';
import { AuthConnexion } from '../../shared/actions/auth-action';
import { Store } from '@ngxs/store';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthState } from '../../shared/states/auth-state';
import { CnxAuth } from '../../shared/models/cnx-auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})

export class Login {
   private store = inject(Store);

  connexion = toSignal(this.store.select(AuthState.isConnected), {
    initialValue: false
  });

  login() {
    let auth = new CnxAuth(true);
    this.store.dispatch(new AuthConnexion(auth));
  }

  logout() {
  let auth = new CnxAuth(false);
  this.store.dispatch(new AuthConnexion(auth)); 
  }

  // username = signal('');
  // password = signal('');

}
  

