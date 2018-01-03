import { Ingredient } from '../shared/ingredient.model';

export class Recipe {
  constructor(
    public owner: string,
    public name: string,
    public description: string,
    public imagePath: string,
    public ingredients: Ingredient[]
  ) {}
}
