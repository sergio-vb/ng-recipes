import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { Ingredient } from '../shared/ingredient.model';
import { OptionalActionModalConfig } from '../shared/optional-action-modal-config.model';

import { ShoppingListService } from './shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  public ingredients: any;
  public isModalOpen: boolean;
  public itemSelected: string;
  public modalConfig: OptionalActionModalConfig;
  public unsavedChangesStatus: boolean;

  constructor(
    private shoppingListService: ShoppingListService,
    private router: Router
  ) {}

  ngOnInit() {

    this.isModalOpen = false;
    this.modalConfig = {
      mainText: "Please log in or register to save your shopping list.",
      leftButtonText: "Register",
      rightButtonText: "Log In",
      leftButtonStyles: "btn",
      rightButtonStyles: "btn"
    }

    this.shoppingListService.getIngredients().subscribe(
      ingredients => {
        console.log("Ingredients received:", ingredients);
        this.ingredients = ingredients;
      },
      error => {
        console.log("getIngredients error:", error);
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
          this.isModalOpen = true;
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

}
