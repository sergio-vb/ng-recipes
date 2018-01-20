import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { AuthRoutingModule } from './auth-routing.module';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';

@NgModule({
    declarations:[
        SignupComponent,
        SigninComponent,
        UnauthorizedComponent
    ],
    imports:[
        CommonModule,
        FormsModule,
        AuthRoutingModule
    ]
})
export class AuthModule{}