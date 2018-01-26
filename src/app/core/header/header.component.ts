import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{
  isAuthenticated: boolean;

  constructor(
    private authService: AuthService
  ){}

  ngOnInit(){
    this.authService.authState.subscribe(
      authState => this.isAuthenticated = !!authState.token,
      error => this.isAuthenticated = false
    );
  }

  onLogout(){
    this.authService.logoutUser();
  }

}
