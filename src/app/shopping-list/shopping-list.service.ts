import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import _ from 'lodash';

import { Ingredient } from '../shared/ingredient.model';
import { AuthService } from '../auth/auth.service';


@Injectable()
export class ShoppingListService implements OnDestroy{
  private authStateSubscription: Subscription;
  private hasUnsavedChanges: boolean;
  private isRemoteListLoaded: boolean;
  private temporaryCachedShoppingList: any;
  public shoppingListChange = new Subject<Ingredient[]>();

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ){ 
    this.init();
  }

  init(){
    this.temporaryCachedShoppingList = {};
    this.isRemoteListLoaded = false;

    this.authStateSubscription = this.authService.getAuthState().subscribe(
      ({userId}) => {
        if (!userId){ //When user logs out
          this.resetCache();
        }
      }
    );
  }

  resetCache(){
    this.temporaryCachedShoppingList = {};
    this.hasUnsavedChanges = false;
    this.isRemoteListLoaded = false;
  }

  ngOnDestroy(){
    this.authStateSubscription.unsubscribe();
  }

  getLocalIngredient(key: string) {
    return _.cloneDeep(this.temporaryCachedShoppingList[key]); //Returns a copy, to avoid giving a direct reference to the object
  }

  //Use getShoppingList() as the public API
  private getLocalIngredients() {
    return _.cloneDeep(this.temporaryCachedShoppingList); //Returns a copy, to avoid giving a direct reference to the object
  }

  addLocalIngredient(ingredient: Ingredient) {
    if (this.temporaryCachedShoppingList[ingredient.name]){
      throw("Ingredient already exists.");
    }
    this.temporaryCachedShoppingList[ingredient.name] = ingredient;
    this.hasUnsavedChanges = true;
    this.shoppingListChange.next(this.getLocalIngredients());
  }

  updateLocalIngredient(oldKey: string, newIngredient: Ingredient){
    if (oldKey != newIngredient.name){
      delete this.temporaryCachedShoppingList[oldKey];
    }
    this.temporaryCachedShoppingList[newIngredient.name] = newIngredient;
    this.hasUnsavedChanges = true;
    this.shoppingListChange.next(this.getLocalIngredients());
  }

  deleteLocalIngredient(key: string){
    delete this.temporaryCachedShoppingList[key];
    this.hasUnsavedChanges = true;
    this.shoppingListChange.next(this.getLocalIngredients());    
  }

  getHasUnsavedChanges(){
    return this.hasUnsavedChanges;
  }

  //Adds the ingredients of a Recipe to the shopping list of a user. 
  // - If the user is logged in it will be saved to their profile automatically.
  // - If the user is a guest it'll only be saved to the temporary shopping list.
  // - If there are any ingredients that already exist in the shopping list they will be automatically merged.
  addIngredientsFromRecipe(ingredients: any) {
    this.temporaryCachedShoppingList = this.mergeLists(this.temporaryCachedShoppingList, ingredients);
    this.hasUnsavedChanges = true;
    
    //If the cache already included the user's saved shopping list, just overwrite it with the new one
    if (this.isRemoteListLoaded){
      return this.saveShoppingList();
    //else, the cache version needs to be merged with the user's shopping list. For guests, the merge won't do anything.
    }else{
      return this.mergeListsAndSave().catch(
        error => {
          if (error === "User not logged in."){ //Catches this error because this is an expected scenario for this functionality
            return Observable.of(this.temporaryCachedShoppingList);
          }
          throw(error);
        }
      );
    }

  }

  //Returns the appropriate shopping list:
  // - If user is a guest, return the temporary shopping list
  // - If user is logged in and their list had been previously loaded into the cache, return the cache
  // - If user is logged in and their list hadn't been previously loaded into the cache, compare the cache version with the
  //   user's saved version. If there is a conflict (any difference) between these two, the method will throw an error, 
  //   to be handled by the consumer.
  getShoppingList(){

    return this.authService.getLatestAuthState().flatMap(
      ({userId}) => {
        
        //If user is logged in
        if (userId){

          //No need to fetch the user's list from the database if it's currently present in the cache
          if (this.isRemoteListLoaded){
            return Observable.of(_.cloneDeep(this.temporaryCachedShoppingList));
          }

          //Gets the shopping list of the user
          return this.httpClient.get(`https://ng-recipes-1sv94.firebaseio.com/shoppingLists/byOwnerId/${userId}.json`)
            .map( userIngredients => userIngredients || {})
            .map( userIngredients => {
              
              //If the user already has a non-empty shopping list, and there's also a non-empty cached temporary shopping list, throw an error
              let userIngredientsLength = Object.keys(userIngredients).length;
              if (userIngredientsLength > 0 && this.temporaryCachedShoppingList && Object.keys(this.temporaryCachedShoppingList).length > 0){
                throw("Shopping lists conflict.");
              
              //Else, return either the user's list if it's non-empty, the existing cache, or an empty object (in that priority)
              }else{
                this.temporaryCachedShoppingList = (userIngredientsLength > 0) ? userIngredients : (this.temporaryCachedShoppingList || {});
                this.isRemoteListLoaded = true;
                return _.cloneDeep(this.temporaryCachedShoppingList);
              }
            });

        //If user is guest (not logged in)
        }else{

          //If there is no cached version already, set it to an empty object
          if (!this.temporaryCachedShoppingList){
            this.temporaryCachedShoppingList = {};
          }
          return Observable.of(_.cloneDeep(this.temporaryCachedShoppingList));
        }
      }
    );
  }
  

  //Saves the cached shopping list to the backend, overwriting it
  saveShoppingList(){
    return this.authService.getLatestAuthState().flatMap(
      ({userId}) => {
        if (!userId){
          throw("User not logged in.");
        }
        return this.httpClient.put(`https://ng-recipes-1sv94.firebaseio.com/shoppingLists/byOwnerId/${userId}.json`, this.temporaryCachedShoppingList)
          .map( ingredients => {
            this.hasUnsavedChanges = false;
            return ingredients;
          });
      }
    );
  }

  //Merges two shopping lists and returns the merged list (Pure function, uses deep cloning)
  mergeLists(list1: any, list2: any){
    let mergedList = _.cloneDeep(list1);
    Object.keys(list2).map( key => {
      
      //If an ingredient already exists in the merged list, add their amounts together
      if (mergedList[key]){
        mergedList[key].amount += list2[key].amount;
      
      //Otherwise, just add the ingredient to the merged list
      }else{
        mergedList[key] = _.cloneDeep(list2[key]);
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
            this.temporaryCachedShoppingList = this.mergeLists(this.temporaryCachedShoppingList, userIngredients);
            this.hasUnsavedChanges = true;
            this.isRemoteListLoaded = true;
            return this.temporaryCachedShoppingList;
          })
          //Save the new merged list to the database
          .flatMap( userIngredients => {
            return this.httpClient.put(`https://ng-recipes-1sv94.firebaseio.com/shoppingLists/byOwnerId/${userId}.json`, this.temporaryCachedShoppingList)
              .map( ingredients => {
                this.hasUnsavedChanges = false;
                return ingredients;
              });
          });
      }
    );
  }

}
