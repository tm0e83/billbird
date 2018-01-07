import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: []
})
export class AppComponent implements OnInit {
  title = 'Billbird';

  constructor(
    private angularFire: AngularFireAuth,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.angularFire.authState.subscribe((auth) => {
      let route = auth ? '/list' : '/login';
      this.router.navigate([route]);
    });
  }
}