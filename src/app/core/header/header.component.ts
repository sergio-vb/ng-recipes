import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy{
  public isAuthenticated: boolean;
  private AuthStateSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router
  ){}

  ngOnInit(){
    this.AuthStateSubscription = this.authService.getAuthState().subscribe(
      authState => this.isAuthenticated = !!authState.token,
      error => this.isAuthenticated = false
    );
  }

  ngOnDestroy(){
    this.AuthStateSubscription.unsubscribe();
  }

  onLogout(){
    this.authService.logoutUser()
      .then( response  => {
        this.router.navigate(['/']);
      });
  }

}
