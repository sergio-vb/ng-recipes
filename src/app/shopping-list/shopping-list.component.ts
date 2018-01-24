import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Ingredient[];
  private subscription: Subscription;
  constructor(private shoppingListService: ShoppingListService) {}

  ngOnInit() {
    console.log("Shopping list initialized");

    this.ingredients = [];
    this.shoppingListService.getIngredients().subscribe(
      ingredients => {
        console.log("Ingredients received:", ingredients);
      },
      error => {
        console.log("getIngredients error:", error);
      }
    );

    this.subscription = this.shoppingListService.ingredientListUpdated.subscribe(
      (ingredients: Ingredient[]) => {
        console.log("Shopping list received ingredients updated")
        this.ingredients = ingredients;
      }
    );
  }

  onEditItem(index:number){
    this.shoppingListService.startedEditing.next(index);
  }

  ngOnDestroy(){
    console.log("Shopping list destroyed");
    this.subscription.unsubscribe();
  }
}
