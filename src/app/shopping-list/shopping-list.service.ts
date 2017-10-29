import { EventEmitter } from '@angular/core';

import { Ingredient } from '../shared/ingredient.model';

export class ShoppingListService {
  ingredientListUpdated = new EventEmitter<Ingredient[]>();

  private ingredients: Ingredient[] = [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatoes', 10)
  ];

  getIngredients() {
    return this.ingredients.slice(); //Returns a copy to avoid giving direct access.
  }

  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
    this.ingredientListUpdated.emit(this.getIngredients());
  }
  addIngredients(ingredients: Ingredient[]) {
    console.log("Ingredients to add: ", ingredients);
    this.ingredients.push(...ingredients);
    this.ingredientListUpdated.emit(this.getIngredients());
  }
}
