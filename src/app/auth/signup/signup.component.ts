import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { NETWORK_ERROR, EMAIL_IN_USE, DEFAULT_ERROR} from '../../shared/errors';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  public error: string;
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onSignup(form: NgForm){
    const { email } = form.value,
          { password } = form.value.passwordGroup;
    
    this.authService.signupUser(email, password)
      .then( response => {
        this.router.navigate(['/']);
        this.error = "";
      })
      .catch( error => {
        switch (error.code){
          case "auth/network-request-failed":
            this.error = NETWORK_ERROR;
            break;
          case "auth/email-already-in-use":
            this.error = EMAIL_IN_USE;
            break;
          default:
            this.error = DEFAULT_ERROR;
        }
      });
  }

}
