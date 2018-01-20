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
        const isAuthenticated = this.authService.isAuthenticated();
        if (!isAuthenticated){
            this.router.navigate(['/signin']);
        }
        return isAuthenticated;
    }
}