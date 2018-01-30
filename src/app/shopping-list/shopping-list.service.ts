import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { Ingredient } from '../shared/ingredient.model';
import { AuthService } from '../auth/auth.service';


@Injectable()
export class ShoppingListService {
  private ingredients: any;
  private unsavedChanges: boolean;
  public ingredientListUpdated = new Subject<Ingredient[]>();

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ){ }

  

  getLocalIngredient(key: string) {
    return Object.assign({}, this.ingredients[key]); //Returns a copy, to avoid giving a direct reference to the object
  }

  getLocalIngredients() {
    return Object.assign({}, this.ingredients); //Returns a copy, to avoid giving a direct reference to the object
  }

  addLocalIngredient(ingredient: Ingredient) {
    if (this.ingredients[ingredient.name]){
      throw("Ingredient already exists.");
    }
    this.ingredients[ingredient.name] = ingredient;
    this.unsavedChanges = true;
    this.ingredientListUpdated.next(this.getLocalIngredients());
  }

  addLocalIngredients(ingredients: Ingredient[]) {
    // console.log('Ingredients to add: ', ingredients);
    // ingredients.map( x => {
    //   this.ingredients[x.name] = x; //Review to avoid overwriting if it already exists
    // });
    // this.ingredientListUpdated.next(this.getLocalIngredients());
  }

  updateLocalIngredient(oldKey: string, newIngredient: Ingredient){
    if (oldKey != newIngredient.name){
      delete this.ingredients[oldKey];
    }
    this.ingredients[newIngredient.name] = newIngredient;
    this.unsavedChanges = true;
    this.ingredientListUpdated.next(this.getLocalIngredients());
  }

  deleteLocalIngredient(key: string){
    delete this.ingredients[key];
    this.unsavedChanges = true;
    this.ingredientListUpdated.next(this.getLocalIngredients());    
  }

  getUnsavedChanges(){
    return this.unsavedChanges;
  }

  getIngredients(){
    return this.authService.getLatestAuthState().flatMap(
      authState => {
        const ownerId = authState.userId;
        if (!ownerId){
          this.ingredients = [];
          return Observable.of([]);
        }
        return this.httpClient.get(`https://ng-recipes-1sv94.firebaseio.com/shoppingLists/byOwnerId/${ownerId}.json`)
          .map( ingredients => {
            this.ingredients = ingredients;
            return ingredients;
          });
      }
    );
  }
  
  saveIngredients(){
    return this.authService.getLatestAuthState().flatMap(
      authState => {
        const ownerId = authState.userId;
        if (!ownerId){
          throw("User not logged in.");
        }
        return this.httpClient.put(`https://ng-recipes-1sv94.firebaseio.com/shoppingLists/byOwnerId/${ownerId}.json`, this.ingredients)
        .map( ingredients => {
          this.unsavedChanges = false;
          return ingredients;
        });
      }
    );
  }

}
