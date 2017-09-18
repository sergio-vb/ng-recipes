import { Component, OnInit } from '@angular/core';

import { Recipe } from './recipe.model';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent implements OnInit {

  selectedRecipe:Recipe = new Recipe(
    'A Recipe for Disaster', 
    'This is simply a test new', 
    'https://static01.nyt.com/images/2015/10/15/dining/15RECIPE20DIN/15RECIPE20DIN-articleLarge.jpg'
  );

  constructor() { }

  ngOnInit() {
  }

  onRecipeSelected(recipe){
    this.selectedRecipe = recipe;
    console.log("Recipe received on the recipes component: ", recipe);
  }

}
