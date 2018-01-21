import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Recipe } from '../recipe.model';
import { ShoppingListService } from '../../shopping-list/shopping-list.service';
import { RecipeService } from '../recipe.service';
import { Ingredient } from '../../shared/ingredient.model';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  ingredients: Ingredient[];
  id: string;
  userOwnsRecipe: boolean;

  constructor(
    private shoppingListService: ShoppingListService,
    private recipeService: RecipeService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {

    this.activatedRoute.params.subscribe(
      (params:Params) => {
        this.id = params.id;
        this.recipeService.getRecipe(this.id).subscribe(
          (recipe: Recipe) => {
            this.recipe = recipe;
          }
        );

        this.ingredients = [];
        this.recipeService.getRecipeIngredients(this.id).subscribe(
          (ingredients) => {
            for (let id in ingredients){
              this.ingredients.push(ingredients[id]);
            }
          }
        );

        this.recipeService.doesUserOwnRecipe(this.id).then(result => this.userOwnsRecipe = result);
      }
    );
  }

  onAddToShoppingList() {
    //this.shoppingListService.addIngredients(this.recipe.ingredients);
  }

  onDeleteRecipe(){
    //this.recipeService.deleteRecipe(this.id);
    //this.router.navigate(['../'], {relativeTo: this.activatedRoute});
  }
}
