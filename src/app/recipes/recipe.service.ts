import { Subject } from 'rxjs/Subject';
import { HttpClient, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import 'rxjs';

import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class RecipeService {

  /* Firebase url: https://ng-recipes-1sv94.firebaseio.com/ */

  recipesUpdated = new Subject<Recipe[]>();
  private currentUserEmail: string;
  private recipes: Recipe[] = [];

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ){
    this.currentUserEmail = "test@test.com";
  }
  
  getRecipe(index) {
    return this.recipes[index];
  }
  addRecipe(recipe:Recipe){
    // this.recipes.push(recipe);
    // this.recipesUpdated.next(this.getRecipes());
  }
  updateRecipe(index:number, recipe:Recipe){
    // this.recipes[index] = recipe;
    // this.recipesUpdated.next(this.getRecipes());    
  }
  deleteRecipe(index){
    // this.recipes.splice(index, 1);
    // this.recipesUpdated.next(this.getRecipes());    
  }
  
  async storeRecipes(){
    const req = new HttpRequest('PUT', 'https://ng-recipes-1sv94.firebaseio.com/recipes.json', this.recipes, {
      reportProgress: true
    });

    this.httpClient.request(req).subscribe(
      response => console.log(response),
      error => console.log(error)
    );
  }

  getRecipes(){
    return this.httpClient.get<Recipe[]>("https://ng-recipes-1sv94.firebaseio.com/recipes.json")
      .map(recipes => {
        for (let recipe of recipes){
          recipe.ingredients = recipe.ingredients || []; //Adds ingredients property if not present
        }
        this.recipes = recipes;
        return recipes;
      }).toPromise();
  }

}
