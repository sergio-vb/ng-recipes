import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AuthService } from "./auth.service";
import { RecipeService } from "../recipes/recipe.service";

@Injectable()
//Checks if the currently logged in user owns the recipe from the currently activated route
export class RoleGuard implements CanActivate{
    constructor(
        private authService: AuthService,
        private recipeService: RecipeService,
        private router: Router
    ){}

    // async canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot){
    //     if (!this.authService.isAuthenticated()){
    //         this.router.navigate(['/signin']);
    //         return false;
    //     }
    //     const result = await this.recipeService.doesUserOwnRecipe(activatedRouteSnapshot.params.id, null);
    //     if (!result){
    //         this.router.navigate(['/unauthorized']);
    //     }
    //     return result;
        
    // }

    canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot){
        return this.authService.getLatestAuthState()
            //Maps response to redirect if not authenticated
            .map( userInfo => {
                console.log("AuthState userInfo:", userInfo);
                const isAuthenticated = !!userInfo.token;
                if (!isAuthenticated){
                    this.router.navigate(['/signin']);
                    throw("User not authenticated"); //Prevents the execution of the flatMap function
                }
                return userInfo.userId;
            })
            //Gets from a promise whether current user owns the recipe, redirecting if they don't
            .flatMap( userId => {
                return this.recipeService.doesRecipeBelongToUser(activatedRouteSnapshot.params.id, null)
                    .map( isUserOwner => {
                        console.log("isUserOwner:", isUserOwner);
                        if (!isUserOwner){
                            this.router.navigate(['/unauthorized']);
                        }
                        return isUserOwner;
                    });
            })
            .catch( error => {
                this.router.navigate(['/signin']);
                return Observable.of(false);
            });
    }
}