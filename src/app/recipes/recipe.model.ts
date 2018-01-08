import { Ingredient } from '../shared/ingredient.model';

export class Recipe {
  constructor(
    public ownerId: string,
    public name: string,
    public description: string,
    public imagePath: string
  ) {}
}
