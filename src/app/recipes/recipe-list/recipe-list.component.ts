import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { ModalConfig } from '../../shared/modal-config.model';
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
  modalConfig: ModalConfig;
  isModalOpen: boolean;


  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private recipeService: RecipeService,
    private router: Router
  ) {}

  ngOnInit() {

    this.isModalOpen = false;
    this.modalConfig = {
      mainText: "You need to log in or register to create a new recipe.",
      leftButtonText: "Register",
      rightButtonText: "Log In",
      leftButtonStyles: "btn",
      rightButtonStyles: "btn"
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
    console.log("onNewRecipeClick executed");
    this.authService.getLatestAuthState().subscribe( //Only interested in first value of authState, not on-going subscription
      authState => {
        console.log("onNewRecipeClick authState:", authState);
        //User logged in
        if (authState.token){
          this.router.navigate(['./new'], {relativeTo: this.activatedRoute});
        //User not logged in, show modal
        }else{
          this.isModalOpen = true;
        }
      },
      error => {
        console.log("onNewRecipeClick error:", error);
        this.isModalOpen = true;
      },
      () => {
        console.log("Thing completed.")
      }
    );
  }

  onModalRegister(){
    this.router.navigate(['/signup']);
  }
  onModalLogin(){
    this.router.navigate(['/signin']);    
  }

}
