import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  error: boolean = false;

  constructor(
    private angularFire: AngularFireAuth,
    private router: Router
  ) {}

  login(): void {
    this.angularFire.auth.signInWithEmailAndPassword(
      this.email,
      this.password
    );
  }

  onInput(): void {
    this.error = false;
  }

  onKeyDown(event): void {
    if(event.keyCode == 13) {
      this.login();
    }
  }
}