import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {

  @Output() recipeSelected = new EventEmitter<{recipe:Recipe}>();

  recipes:Recipe[] = [
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
  ];

  constructor() { }

  ngOnInit() {
  }

  onRecipeSelected(recipe){
    this.recipeSelected.emit({recipe});
  }

}
