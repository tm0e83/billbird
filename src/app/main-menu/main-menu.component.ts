import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
    selector: 'main-menu',
    templateUrl: './main-menu.component.html'
})
export class MainMenuComponent {
    constructor(
        private angularFire: AngularFireAuth,
        private router: Router
    ) {}

    logout(): void {
        this.angularFire.auth.signOut();
        this.router.navigate(['/']);
    }
}