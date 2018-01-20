import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Injectable } from '@angular/core';

import { AuthService } from "./auth.service";
import { RecipeService } from "../recipes/recipe.service";

@Injectable()
export class RoleGuard implements CanActivate{
    constructor(
        private authService: AuthService,
        private recipeService: RecipeService,
        private router: Router
    ){}

    async canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot){
        if (!this.authService.isAuthenticated()){
            this.router.navigate(['/signin']);
            return false;
        }
        const result = await this.recipeService.doesUserOwnRecipe(activatedRouteSnapshot.params.id);
        if (!result){
            this.router.navigate(['/unauthorized']);
        }
        return result;
        
    }
}