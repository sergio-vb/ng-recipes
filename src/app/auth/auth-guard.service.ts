import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Injectable } from '@angular/core';

import { AuthService } from "./auth.service";

@Injectable()
export class AuthGuard implements CanActivate{
    constructor(
        private authService: AuthService,
        private router: Router
    ){}

    canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot){
        return this.authService.authState.map(
            authState => {
                const isAuthenticated = !!authState.token;
                if (!isAuthenticated){
                    this.router.navigate(['/signin']);
                }
                return isAuthenticated;
            },
            error => {
                return false;
            }
        );
    }
}