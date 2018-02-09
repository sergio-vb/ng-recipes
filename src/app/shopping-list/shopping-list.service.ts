import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import { Ingredient } from '../shared/ingredient.model';
import { AuthService } from '../auth/auth.service';


@Injectable()
export class ShoppingListService implements OnDestroy{
  private ingredients: any;
  private unsavedChangesStatus: boolean;
  private remoteDataInitialized: boolean;
  public ingredientListUpdated = new Subject<Ingredient[]>();
  private authStateSubscription: Subscription;

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ){ 
    this.init();
  }

  init(){
    this.remoteDataInitialized = false;
    this.authStateSubscription = this.authService.getAuthState().subscribe(
      ({userId}) => {
        if (!userId){
          this.resetCache();
        }
      }
    );
  }

  resetCache(){
    this.ingredients = {};
    this.unsavedChangesStatus = false;
    this.remoteDataInitialized = false;
  }

  ngOnDestroy(){
    this.authStateSubscription.unsubscribe();
  }

  getLocalIngredient(key: string) {
    return Object.assign({}, this.ingredients[key]); //Returns a copy, to avoid giving a direct reference to the object
  }

  getLocalIngredients() {
    return Object.assign({}, this.ingredients); //Returns a copy, to avoid giving a direct reference to the object
  }

  addLocalIngredient(ingredient: Ingredient) {
    if (this.ingredients[ingredient.name]){
      throw("Ingredient already exists.");
    }
    this.ingredients[ingredient.name] = ingredient;
    this.unsavedChangesStatus = true;
    this.ingredientListUpdated.next(this.getLocalIngredients());
  }

  updateLocalIngredient(oldKey: string, newIngredient: Ingredient){
    if (oldKey != newIngredient.name){
      delete this.ingredients[oldKey];
    }
    this.ingredients[newIngredient.name] = newIngredient;
    this.unsavedChangesStatus = true;
    this.ingredientListUpdated.next(this.getLocalIngredients());
  }

  deleteLocalIngredient(key: string){
    delete this.ingredients[key];
    this.unsavedChangesStatus = true;
    this.ingredientListUpdated.next(this.getLocalIngredients());    
  }

  getUnsavedChangesStatus(){
    return this.unsavedChangesStatus;
  }

  //Adds the ingredients of a Recipe to the shopping list of a user. 
  // - If the user is logged in will be saved to their profile automatically.
  // - If the user is a guest it'll only be saved to the temporary shopping list.
  // - If there are any ingredients that already exist in the shopping list they will be automatically merged.
  addIngredientsFromRecipe(ingredients: any) {
    this.ingredients = this.mergeLists(this.ingredients, ingredients);
    
    //If the cache already included the user's saved shopping list, just overwrite it with the new one
    if (this.remoteDataInitialized){
      return this.saveIngredients();
    //else, the cache version needs to be merged with the user's shopping list. For guests, the merge won't do anything.
    }else{
      return this.mergeListsAndSave().catch(
        error => {
          if (error === "User not logged in."){ //Catches this error because this is an expected scenario for this functionality
            return Observable.of(this.ingredients);
          }
          throw(error);
        }
      );
    }

  }

  //Returns either the temporary shopping list or the user's list saved in the database.
  // - If there is a conflict (any difference) between these two, the method will throw an error, to be handled by the consumer.
  // - Use the method mergeListsAndSave() to merge the two lists together.
  getIngredients(){

    return this.authService.getLatestAuthState().flatMap(
      ({userId}) => {
        
        //If user is logged in
        if (userId){

          //If there's a non-empty cached version, and there are no unsaved changes, return the cached version
          if (this.ingredients && Object.keys(this.ingredients).length > 0 && !this.unsavedChangesStatus){
            return Observable.of(this.ingredients);
          }

          //Gets the shopping list of the user
          return this.httpClient.get(`https://ng-recipes-1sv94.firebaseio.com/shoppingLists/byOwnerId/${userId}.json`)
            .map( userIngredients => userIngredients || {})
            .map( userIngredients => {
              
              //If the user already has a non-empty shopping list, and there's also a non-empty cached temporary shopping list, throw an error
              let userIngredientsLength = Object.keys(userIngredients).length;
              if (userIngredientsLength > 0 && this.ingredients && Object.keys(this.ingredients).length > 0){
                throw("Shopping lists conflict.");
              
              //Else, return either the user's list if it's non-empty, the existing cache, or an empty object (in that priority)
              }else{
                this.ingredients = (userIngredientsLength > 0) ? userIngredients : (this.ingredients || {});
                this.remoteDataInitialized = true;
                return this.ingredients;
              }
            });

        //If user is guest (not logged in)
        }else{

          //If there is no cached version already, set it to an empty object
          if (!this.ingredients){
            this.ingredients = {};
          }
          return Observable.of(this.ingredients);
        }
      }
    );
  }
  

  //Saves the cached shopping list to the backend, overwriting it
  saveIngredients(){
    return this.authService.getLatestAuthState().flatMap(
      ({userId}) => {
        if (!userId){
          throw("User not logged in.");
        }
        return this.httpClient.put(`https://ng-recipes-1sv94.firebaseio.com/shoppingLists/byOwnerId/${userId}.json`, this.ingredients)
          .map( ingredients => {
            this.unsavedChangesStatus = false;
            return ingredients;
          });
      }
    );
  }

  //Merges two lists and returns the merged list (shallow copy)
  mergeLists(list1: any, list2: any){
    let mergedList = {};
    Object.assign(mergedList, list1);
    Object.keys(list2).map( key => {
      
      //If an ingredient already exists in the merged list, add their amounts together
      if (mergedList[key]){
        mergedList[key].amount += list2[key].amount;
      
      //Otherwise, just add the ingredient to the merged list
      }else{
        mergedList[key] = list2[key];
      }
    });
    return mergedList;
  }

  //Merges the temporary shopping list with the user's list saved in the database.
  //The end result is stored in both the temporary cache and also in the database.
  mergeListsAndSave(){
    return this.authService.getLatestAuthState().flatMap(
      ({userId}) => {
        if (!userId){
          throw("User not logged in.");
        }
        //If user is authenticated, get their shopping list from backend
        return this.httpClient.get(`https://ng-recipes-1sv94.firebaseio.com/shoppingLists/byOwnerId/${userId}.json`)
          .map( userIngredients => userIngredients || {})
          .map( userIngredients => {
            this.ingredients = this.mergeLists(this.ingredients, userIngredients);
            this.unsavedChangesStatus = true;
            this.remoteDataInitialized = true;
            return this.ingredients;
          })
          //Save the new merged list to the database
          .flatMap( userIngredients => {
            return this.httpClient.put(`https://ng-recipes-1sv94.firebaseio.com/shoppingLists/byOwnerId/${userId}.json`, this.ingredients)
              .map( ingredients => {
                this.unsavedChangesStatus = false;
                return ingredients;
              });
          });
      }
    );
  }

}
