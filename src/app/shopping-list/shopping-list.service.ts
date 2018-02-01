import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { Ingredient } from '../shared/ingredient.model';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs/Subscription';


@Injectable()
export class ShoppingListService implements OnDestroy{
  private ingredients: any;
  private unsavedChangesStatus: boolean;
  public ingredientListUpdated = new Subject<Ingredient[]>();
  private authStateSubscription: Subscription;

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ){ 
    this.init();
  }

  init(){
    this.authStateSubscription = this.authService.getAuthState().subscribe(
      ({userId}) => {
        if (!userId){
          this.ingredients = {};
          this.unsavedChangesStatus = false;
        }
      }
    );
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

  addLocalIngredients(ingredients: Ingredient[]) {
    // console.log('Ingredients to add: ', ingredients);
    // ingredients.map( x => {
    //   this.ingredients[x.name] = x; //Review to avoid overwriting if it already exists
    // });
    // this.ingredientListUpdated.next(this.getLocalIngredients());
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

  getIngredients(){

    /*
    - If user is logged in
      - If there's a non-empty cached version, and there are no unsaved changes, return the cached version (because it would necessarily match the database version, so there is no need to fetch it).
      - Get user's shopping list from database:
        - If the user already has a non-empty shopping list, and there's also a non-empty cached temporary shopping list, throw an error.
        - Else, return either the user's list if it's non-empty, the existing cache, or an empty object (in that priority).

    - If user is guest
      - If there is no cached version already, set it to an empty object.
      - Return the cache.

    */
    
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
  
  saveIngredients(){
    return this.authService.getLatestAuthState().flatMap(
      authState => {
        const ownerId = authState.userId;
        if (!ownerId){
          throw("User not logged in.");
        }
        return this.httpClient.put(`https://ng-recipes-1sv94.firebaseio.com/shoppingLists/byOwnerId/${ownerId}.json`, this.ingredients)
        .map( ingredients => {
          this.unsavedChangesStatus = false;
          return ingredients;
        });
      }
    );
  }

}
