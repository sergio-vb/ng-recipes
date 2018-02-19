import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import { ConfirmationModalConfig } from '../shared/confirmation-modal-config.model';
import { Ingredient } from '../shared/ingredient.model';

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
  public loading: boolean;
  
  //Modals
  public isSaveListModalOpen: boolean;
  public saveListModalConfig: ConfirmationModalConfig;
  public isListConflictModalOpen: boolean;
  public listConflictModalConfig: ConfirmationModalConfig;
  public isCanDeactivateModalOpen: boolean;
  public canDeactivateModalConfig: ConfirmationModalConfig;
  private canDeactivateSubject: Subject<boolean>;
  
  constructor(
    private authService: AuthService,
    private shoppingListService: ShoppingListService,
    private router: Router
  ) {}

  ngOnInit() {

    this.loading = true;
    this.initializeModals();
    this.initializeData();

    this.subscription = this.shoppingListService.shoppingListChange.subscribe(
      (ingredients) => {
        this.unsavedChangesStatus = this.shoppingListService.getHasUnsavedChanges();
        this.ingredients = ingredients;
      }
    );
  }

  initializeModals(){
    this.isSaveListModalOpen = false;
    this.saveListModalConfig = {
      mainText: "Please log in or register to save your shopping list.",
      actionRequired: false,
      buttons: [
        {
          text: "Register",
          styles: "btn"
        },
        {
          text: "Log In",
          styles: "btn"
        },
      ]
    }

    this.isListConflictModalOpen = false;
    this.listConflictModalConfig = {
      mainText: "You have a saved shopping list and an unsaved list. Do you want to merge them together?",
      actionRequired: true,
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
      actionRequired: true,
      buttons: [
        {
          text: "Go back",
          styles: "btn btn-flat"
        },
        {
          text: "Leave",
          styles: "btn warning"
        }
      ]
    };
  }

  initializeData(){
    this.shoppingListService.getShoppingList().subscribe(
      ingredients => {
        this.ingredients = ingredients;
        this.isListConflictModalOpen = false;
        this.unsavedChangesStatus = this.shoppingListService.getHasUnsavedChanges();
        this.loading = false;
      },
      error => {
        console.log("getShoppingList error:", error);
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
    this.shoppingListService.saveShoppingList().subscribe(
      success => {
        this.unsavedChangesStatus = this.shoppingListService.getHasUnsavedChanges();
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

  onSaveListModalClick(buttonIndex: number){
    switch (buttonIndex){
      case 0:
        this.router.navigate(['/signup']);
        break;
      case 1:
        this.router.navigate(['/signin']);    
        break;
    }
  }

  onListConflictModalClick(buttonIndex: number){
    switch (buttonIndex){

      //Keep both lists and merge them together
      case 0:
        this.shoppingListService.mergeListsAndSave().subscribe(
          ingredients => {
            this.ingredients = ingredients;
            this.isListConflictModalOpen = false;
            this.unsavedChangesStatus = this.shoppingListService.getHasUnsavedChanges();        
          }
        );
        break;
      
      //Keep only the unsaved list: Saves the cached version, overwriting the previously saved list
      case 1:
        this.shoppingListService.saveShoppingList().subscribe(
          success => {
            this.isListConflictModalOpen = false;
            this.unsavedChangesStatus = this.shoppingListService.getHasUnsavedChanges();
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
      case 1:
        this.canDeactivateSubject.next(true);
        break;
    }
    this.isCanDeactivateModalOpen = false;    
  }

}
