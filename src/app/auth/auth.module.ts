import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthRoutingModule } from './auth-routing.module';
import { PasswordConfirmationValidatorDirective } from './password-confirmation.directive';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';

@NgModule({
    declarations:[
        PasswordConfirmationValidatorDirective,
        SigninComponent,
        SignupComponent,
        UnauthorizedComponent
    ],
    imports:[
        AuthRoutingModule,
        CommonModule,
        FormsModule
    ]
})
export class AuthModule{}