import { Subject } from 'rxjs/Subject';

import { Ingredient } from '../shared/ingredient.model';

export class ShoppingListService {
  ingredientListUpdated = new Subject<Ingredient[]>();
  startedEditing = new Subject<number>();

  private ingredients: Ingredient[] = [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatoes', 10)
  ];

  getIngredient(index: number) {
    return this.ingredients[index];
  }

  getIngredients() {
    return this.ingredients.slice(); //Returns a copy to avoid giving direct access.
  }

  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
    this.ingredientListUpdated.next(this.getIngredients());
  }
  addIngredients(ingredients: Ingredient[]) {
    console.log('Ingredients to add: ', ingredients);
    this.ingredients.push(...ingredients);
    this.ingredientListUpdated.next(this.getIngredients());
  }

  updateIngredient(index: number, newIngredient: Ingredient){
    this.ingredients[index] = newIngredient;
    this.ingredientListUpdated.next(this.ingredients.slice());
  }

  deleteIngredient(index: number){
    this.ingredients.splice(index, 1);
    this.ingredientListUpdated.next(this.getIngredients());
  }
}
