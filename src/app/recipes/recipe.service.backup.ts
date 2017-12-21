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
  
  getRecipes() {
    return this.recipes.slice(); //Returns a copy, to avoid giving direct access
  }
  getRecipe(index) {
    return this.recipes[index];
  }
  addRecipe(recipe:Recipe){
    this.recipes.push(recipe);
    this.recipesUpdated.next(this.getRecipes());
  }
  updateRecipe(index:number, recipe:Recipe){
    this.recipes[index] = recipe;
    this.recipesUpdated.next(this.getRecipes());    
  }
  deleteRecipe(index){
    this.recipes.splice(index, 1);
    this.recipesUpdated.next(this.getRecipes());    
  }
  
  async storeRecipes(){
    //const token = await this.authService.getToken();
    
    // this.httpClient.put("https://ng-recipes-1sv94.firebaseio.com/recipes.json", this.recipes, {
    //   //headers: new HttpHeaders().set('Authorization', 'Bearer lorem ipsum') Example of setting headers, not needed in this case
    //   params: new HttpParams().set('auth', token),
    //   //observe: 'events'
    // })
    const req = new HttpRequest('PUT', 'https://ng-recipes-1sv94.firebaseio.com/recipes.json', this.recipes, {
      //params: new HttpParams().set('auth', token),
      reportProgress: true
    });
    this.httpClient.request(req)
      .subscribe(
        response => console.log(response),
        error => console.log(error)
      );
  }
  async fetchRecipes(){
    //const token = await this.authService.getToken();
    
    // this.httpClient.get<Recipe[]>("https://ng-recipes-1sv94.firebaseio.com/recipes.json?auth=" + token)
    console.log("Fetching data");
    this.httpClient.get<Recipe[]>("https://ng-recipes-1sv94.firebaseio.com/recipes.json")
    .map(recipes => {
      console.log("Data:", recipes);
      for (let recipe of recipes){
        recipe.ingredients = recipe.ingredients || []; //Adds ingredients property if not present
      }
      return recipes;
    })
    .subscribe(recipes => {
      console.log("Data:", recipes);
      this.recipes = recipes;
      this.recipesUpdated.next(this.getRecipes());
    });
  }
}
