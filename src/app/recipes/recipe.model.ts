import { Ingredient } from '../shared/ingredient.model';

export class Recipe {
  constructor(
    public name: string,
    public description: string,
    public imagePath: string,
    public ingredients: Ingredient[]
  ) {}
}

/* Using a model class vs an interface:
https://stackoverflow.com/questions/37652801/when-to-use-interface-and-model-in-typescript-angular2
 */
