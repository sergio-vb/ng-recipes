import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { Ingredient } from '../shared/ingredient.model';
import { OptionalActionModalConfig } from '../shared/optional-action-modal-config.model';

import { ShoppingListService } from './shopping-list.service';
import { RequiredActionModalConfig } from '../shared/required-action-modal-config.model';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  public ingredients: any;
  public itemSelected: string;
  public unsavedChangesStatus: boolean;
  
  public isSaveListModalOpen: boolean;
  public saveListModalConfig: OptionalActionModalConfig;
  
  public isListConflictModalOpen: boolean;
  public listConflictModalConfig: RequiredActionModalConfig;

  constructor(
    private shoppingListService: ShoppingListService,
    private router: Router
  ) {}

  ngOnInit() {

    this.isSaveListModalOpen = false;
    this.saveListModalConfig = {
      mainText: "Please log in or register to save your shopping list.",
      leftButtonText: "Register",
      rightButtonText: "Log In",
      leftButtonStyles: "btn",
      rightButtonStyles: "btn"
    }

    this.isListConflictModalOpen = false;
    this.listConflictModalConfig = {
      mainText: "You have a saved shopping list and an unsaved list. Do you want to merge them together?",
      buttons: [
        {
          text: "Keep unsaved only",
          styles: "btn single-column-btn"
        },
        {
          text: "Keep saved only",
          styles: "btn single-column-btn"
        },
        {
          text: "Keep both and merge",
          styles: "btn single-column-btn"
        }
      ]
    };

    /* Second modal:
      You have a saved shopping list and an unsaved list. Do you want to merge them together?
        Merge them together (Recommended)
        Keep only the unsaved list
        Keep only the saved list
    */

    this.shoppingListService.getIngredients().subscribe(
      ingredients => {
        console.log("Ingredients received:", ingredients);
        this.ingredients = ingredients;
      },
      error => {
        console.log("getIngredients error:", error);
        if (error === "Shopping lists conflict."){
          this.isListConflictModalOpen = true;
        }
      }
    );

    this.unsavedChangesStatus = this.shoppingListService.getUnsavedChangesStatus();

    this.subscription = this.shoppingListService.ingredientListUpdated.subscribe(
      (ingredients) => {
        console.log("Shopping list received ingredients updated:", ingredients);
        this.unsavedChangesStatus = this.shoppingListService.getUnsavedChangesStatus();
        console.log("UnsavedChangesStatus:", this.unsavedChangesStatus);
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
        this.unsavedChangesStatus = this.shoppingListService.getUnsavedChangesStatus();
      },
      error => {
        if (error === "User not logged in."){
          this.isSaveListModalOpen = true;
        }
      }
    );
  }

  ngOnDestroy(){
    console.log("Shopping list destroyed");
    this.subscription.unsubscribe();
  }

  onModalRegister(){
    this.router.navigate(['/signup']);
  }

  onModalLogin(){
    this.router.navigate(['/signin']);    
  }

  onListConflictModalClick(buttonIndex: number){
    console.log("Button clicked:", buttonIndex);
  }

}
