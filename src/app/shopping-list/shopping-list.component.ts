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
  private subscription: Subscription;
  public ingredients: any;
  public itemSelected: string;
  public unsavedChanges: boolean;

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
        this.unsavedChanges = this.shoppingListService.getUnsavedChanges();
        this.ingredients = ingredients;
      }
    );
  }

  onEditItem(key: string){
    this.itemSelected = key;
  }

  onSaveList(){
    this.shoppingListService.saveIngredients().subscribe(
      success => {
        this.unsavedChanges = this.shoppingListService.getUnsavedChanges();
      },
      error => {
        console.log("Save ingredients error:", error);
      }
    );
  }

  ngOnDestroy(){
    console.log("Shopping list destroyed");
    this.subscription.unsubscribe();
  }
}
