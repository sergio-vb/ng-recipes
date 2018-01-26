import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { Ingredient } from '../shared/ingredient.model';
import { AuthService } from '../auth/auth.service';


@Injectable()
export class ShoppingListService {
  ingredientListUpdated = new Subject<Ingredient[]>();
  startedEditing = new Subject<number>();
  private ingredients: Ingredient[];

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ){ }

  

  getLocalIngredient(index: number) {
    return this.ingredients[index];
  }

  getLocalIngredients() {
    return this.ingredients.slice(); //Returns a copy to avoid giving direct access.
  }

  addLocalIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
    this.ingredientListUpdated.next(this.getLocalIngredients());
  }

  addLocalIngredients(ingredients: Ingredient[]) {
    console.log('Ingredients to add: ', ingredients);
    this.ingredients.push(...ingredients);
    this.ingredientListUpdated.next(this.getLocalIngredients());
  }

  updateLocalIngredient(index: number, newIngredient: Ingredient){
    this.ingredients[index] = newIngredient;
    this.ingredientListUpdated.next(this.getLocalIngredients());
  }

  deleteLocalIngredient(index: number){
    this.ingredients.splice(index, 1);
    this.ingredientListUpdated.next(this.getLocalIngredients());
  }

  getIngredients(){
    return this.authService.authState.flatMap(
      authState => {
        const ownerId = authState.userId;
        if (!ownerId){
          return Observable.of([]);
        }
        return this.httpClient.get(`https://ng-recipes-1sv94.firebaseio.com/shoppingLists/byOwnerId/${ownerId}.json`);        
      }
    );
  }

}
