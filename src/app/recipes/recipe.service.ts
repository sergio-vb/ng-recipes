import { EventEmitter } from '@angular/core';

import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';

export class RecipeService {
  recipeSelected = new EventEmitter<Recipe>();

  private recipes: Recipe[] = [
    /*
    new Recipe(
      'A Recipe for Disaster',
      'This is simply a test',
      'https://static01.nyt.com/images/2015/10/15/dining/15RECIPE20DIN/15RECIPE20DIN-articleLarge.jpg'
    ),
    new Recipe(
      'Delicious Lasagna',
      'Test lasagna',
      'https://static01.nyt.com/images/2015/10/15/dining/15RECIPE20DIN/15RECIPE20DIN-articleLarge.jpg'
    ),
    new Recipe(
      'Magnificent Pizza',
      'Best pizza ever',
      'https://vignette2.wikia.nocookie.net/le-miiverse-resource/images/5/5d/Delicious_pizza_t2.jpg/revision/latest?cb=20141016025745'
    )
    */
    new Recipe(
      'Skillet Chicken and Quinoa with Fresh Salsa',
      'A filling and fresh dish. Topping with the homemade salsa is a must!',
      'http://images.media-allrecipes.com/userphotos/720x405/4535588.jpg',
      [new Ingredient('Chicken', 200), new Ingredient('Tomato', 4)]
    ),
    new Recipe(
      'Delicious Lasagna',
      'Test lasagna',
      'https://static01.nyt.com/images/2015/10/15/dining/15RECIPE20DIN/15RECIPE20DIN-articleLarge.jpg',
      [new Ingredient('Meat', 100), new Ingredient('Tomato', 7)]
    )
  ];

  getRecipes() {
    return this.recipes.slice(); //Returns a copy, to avoid giving direct access
  }
  getRecipe(index) {
    return this.recipes[index];
  }
}
