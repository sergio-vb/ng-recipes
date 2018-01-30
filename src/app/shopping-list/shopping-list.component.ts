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
  public ingredients: any;
  private subscription: Subscription;
  itemSelected: string;

  constructor(private shoppingListService: ShoppingListService) {}

  ngOnInit() {
    this.shoppingListService.getIngredients().subscribe(
      ingredients => {
        console.log("Ingredients received:", ingredients);
        this.ingredients = ingredients;
      },
      error => {
        console.log("getIngredients error:", error);
      }
    );

    this.subscription = this.shoppingListService.ingredientListUpdated.subscribe(
      (ingredients) => {
        console.log("Shopping list received ingredients updated:", ingredients);
        this.ingredients = ingredients;
      }
    );
  }

  onEditItem(key: string){
    this.itemSelected = key;
  }

  ngOnDestroy(){
    console.log("Shopping list destroyed");
    this.subscription.unsubscribe();
  }
}
