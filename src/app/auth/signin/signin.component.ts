import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { NETWORK_ERROR, INVALID_LOGIN } from '../../shared/errors';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent {
  public error: string;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onSignin(form: NgForm){
    const { email, password } = form.value;
    this.authService.loginUser(email, password)
      .then( response => {
        this.router.navigate(['/']);
        this.error = "";
      })
      .catch( error => {
        switch (error.code){
          case "auth/network-request-failed":
            this.error = NETWORK_ERROR;
            break;
          default:
            this.error = INVALID_LOGIN;
        }
      });
  }

}
