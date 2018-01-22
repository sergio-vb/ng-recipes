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
  
  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ){ }
  
  /*getRecipe(index) {
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
  }*/
  
  /*async storeRecipes(){
    const req = new HttpRequest('PUT', 'https://ng-recipes-1sv94.firebaseio.com/recipes.json', this.recipes, {
      reportProgress: true
    });

    this.httpClient.request(req).subscribe(
      response => console.log(response),
      error => console.log(error)
    );
  }*/

  

  //CRUD recipe operations:
  getRecipes(){
    return this.httpClient.get("https://ng-recipes-1sv94.firebaseio.com/recipes/byId.json");
  }
  getRecipe(id: string){
    return this.httpClient.get(`https://ng-recipes-1sv94.firebaseio.com/recipes/byId/${id}.json`);
  }
  addRecipe(recipe: Recipe, ingredients: Ingredient[]){
    return this.httpClient.post("https://ng-recipes-1sv94.firebaseio.com/recipes/byId.json", recipe).flatMap((response:any) => {
      //If successful, create ingredients under the new recipe id  
      if (response.name){
        return this.httpClient.put(`https://ng-recipes-1sv94.firebaseio.com/recipeIngredients/byRecipeId/${response.name}.json`, ingredients).map((response:any) => {
          this.recipesUpdated.next();
          return response;
        });
      }
    });
  }

  updateRecipe(id: string, recipe: Recipe, ingredients: Ingredient[]){
    return this.httpClient.put(`https://ng-recipes-1sv94.firebaseio.com/recipes/byId/${id}.json`, recipe).flatMap((response:any) => {
      if (response.name){
        return this.httpClient.put(`https://ng-recipes-1sv94.firebaseio.com/recipeIngredients/byRecipeId/${id}.json`, ingredients).map((response:any) => {
          this.recipesUpdated.next();
          return response;
        });
      }
    });
  }
  deleteRecipe(id: number){}

  slugify(text: string){
    return text
      .toLowerCase()
      .replace(/[^\w ]+/g,'')
      .replace(/ +/g,'-');
  }

  getRecipeIngredients(id: string){
    return this.httpClient.get(`https://ng-recipes-1sv94.firebaseio.com/recipeIngredients/byRecipeId/${id}.json`);   
  }

  async doesUserOwnRecipe(recipeId: string): Promise<boolean>{
    const recipe:any = await this.getRecipe(recipeId).toPromise();
    return (recipe.ownerId && (recipe.ownerId === this.authService.getUserId())); //Edge case: Should not return true if both are undefined
  }

}
