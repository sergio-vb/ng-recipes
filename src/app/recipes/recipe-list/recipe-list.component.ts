import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { ConfirmationModalConfig } from '../../shared/confirmation-modal-config.model';
import { Recipe } from '../recipe.model';

import { AuthService } from '../../auth/auth.service';
import { RecipeService } from '../recipe.service';


@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[];
  recipeSubscription: Subscription;
  newRecipeModalConfig: ConfirmationModalConfig;
  isNewRecipeModalOpen: boolean;


  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private recipeService: RecipeService,
    private router: Router
  ) {}

  ngOnInit() {

    this.isNewRecipeModalOpen = false;
    this.newRecipeModalConfig = {
      mainText: "You need to log in or register to create a new recipe.",
      actionRequired: false,
      buttons: [
        {
          text: "Register",
          styles: "btn"
        },
        {
          text: "Log In",
          styles: "btn"
        }
      ]
    }

    this.getRecipes();

    this.recipeSubscription = this.recipeService.recipesUpdated.subscribe(
      (res) => {
        this.getRecipes();
      }
    );
  }

  ngOnDestroy() {
    this.recipeSubscription.unsubscribe();
  }

  getRecipes(){
    this.recipes = [];
    this.recipeService.getRecipes().subscribe(
      recipes => {
        for (let id in recipes){
          recipes[id].id = id; //Adding an id property to each recipe object
          this.recipes.push(recipes[id]);
        }
      }
    );
  }

  onNewRecipeClick(){
    this.authService.getLatestAuthState().subscribe( //Only interested in first value of authState, not on-going subscription
      authState => {
        //User logged in
        if (authState.token){
          this.router.navigate(['./new'], {relativeTo: this.activatedRoute});
        //User not logged in, show modal
        }else{
          this.isNewRecipeModalOpen = true;
        }
      },
      error => {
        this.isNewRecipeModalOpen = true;
      }
    );
  }

  onNewRecipeModalClick(buttonIndex: number){
    switch (buttonIndex){
      case 0:
        this.router.navigate(['/signup']);
        break;
      case 1:
        this.router.navigate(['/signin']);    
        break;
    }
  }

}
