import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[];
  private recipeSubscription: Subscription;

  constructor(private recipeService: RecipeService) {}

  ngOnInit() {
    this.recipes = [];
    this.recipeService.getRecipes().subscribe(
      recipes => {
        for (let id in recipes){
          recipes[id].id = id; //Adding an id property to each recipe object
          this.recipes.push(recipes[id]);
        }
      }
    );

    this.recipeSubscription = this.recipeService.recipesUpdated.subscribe(
      (recipes: Recipe[]) => {
        //Remember to clean recipes array if appropriate
        this.recipes = recipes;
      }
    );
  }

  ngOnDestroy() {
    this.recipeSubscription.unsubscribe();
  }
}
