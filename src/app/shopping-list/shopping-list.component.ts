import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import { Ingredient } from '../shared/ingredient.model';
import { OptionalActionModalConfig } from '../shared/optional-action-modal-config.model';
import { RequiredActionModalConfig } from '../shared/required-action-modal-config.model';

import { AuthService } from '../auth/auth.service';
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
  public unsavedChangesStatus: boolean;
  
  //Modals
  public isSaveListModalOpen: boolean;
  public saveListModalConfig: OptionalActionModalConfig;
  public isListConflictModalOpen: boolean;
  public listConflictModalConfig: RequiredActionModalConfig;
  public isCanDeactivateModalOpen: boolean;
  public canDeactivateModalConfig: RequiredActionModalConfig;
  private canDeactivateSubject: Subject<boolean>;
  
  constructor(
    private authService: AuthService,
    private shoppingListService: ShoppingListService,
    private router: Router
  ) {}

  ngOnInit() {

    this.initializeModals();
    this.initializeData();

    this.subscription = this.shoppingListService.ingredientListUpdated.subscribe(
      (ingredients) => {
        console.log("Shopping list received ingredients updated:", ingredients);
        this.unsavedChangesStatus = this.shoppingListService.getUnsavedChangesStatus();
        console.log("UnsavedChangesStatus:", this.unsavedChangesStatus);
        this.ingredients = ingredients;
      }
    );
  }

  initializeModals(){
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
          text: "Keep both and merge (Recommended)",
          styles: "btn single-column-btn"
        },
        {
          text: "Keep unsaved only",
          styles: "btn orange single-column-btn"
        },
        {
          text: "Keep saved only",
          styles: "btn orange single-column-btn"
        },
      ]
    };

    this.canDeactivateSubject = new Subject();
    this.isCanDeactivateModalOpen = false;
    this.canDeactivateModalConfig = {
      mainText: "You have unsaved items in your shopping list. Do you want to leave this page?",
      buttons: [
        {
          text: "Go back",
          styles: "btn"
        },
        {
          text: "Leave",
          styles: "btn"
        }
      ]
    };
  }

  initializeData(){
    this.shoppingListService.getIngredients().subscribe(
      ingredients => {
        console.log("Ingredients received:", ingredients);
        this.ingredients = ingredients;
        this.isListConflictModalOpen = false;
        this.unsavedChangesStatus = this.shoppingListService.getUnsavedChangesStatus();
      },
      error => {
        console.log("getIngredients error:", error);
        if (error === "Shopping lists conflict."){
          this.isListConflictModalOpen = true;
        }
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
    switch (buttonIndex){

      //Keep both lists and merge them together
      case 0:
        this.shoppingListService.mergeLists().subscribe(
          ingredients => {
            this.ingredients = ingredients;
            this.isListConflictModalOpen = false;
            this.unsavedChangesStatus = this.shoppingListService.getUnsavedChangesStatus();        
          }
        );
        break;
      
      //Keep only the unsaved list: Saves the cached version, overwriting the previously saved list
      case 1:
        this.shoppingListService.saveIngredients().subscribe(
          success => {
            this.isListConflictModalOpen = false;
            this.unsavedChangesStatus = this.shoppingListService.getUnsavedChangesStatus();
          }
        );
        break;

      //Keep only the saved list: Clears cached version and fetches saved list again
      case 2:
        this.shoppingListService.resetCache();
        this.initializeData();
        break;
      
    }
  }

  canDeactivate(){
    return this.authService.getLatestAuthState().flatMap(
      ({userId}) => {
        if (userId && this.unsavedChangesStatus){
          this.isCanDeactivateModalOpen = true;
          return this.canDeactivateSubject;
        }else{
          return Observable.of(true);
        }
      }
    );
  }
  onCanDeactivateModalClick(buttonIndex: number){
    switch (buttonIndex){
      case 0:
        this.canDeactivateSubject.next(false);
        break;
      default:
        this.canDeactivateSubject.next(true);
    }
    this.isCanDeactivateModalOpen = false;    
  }

}
