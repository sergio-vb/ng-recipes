import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import _ from 'lodash';

import { Ingredient } from '../../shared/ingredient.model';
import { ConfirmationModalConfig } from '../../shared/confirmation-modal-config.model';
import { Recipe } from '../recipe.model';

import { RecipeService } from '../recipe.service';
import { ShoppingListService } from '../../shopping-list/shopping-list.service';


@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss']
})
export class RecipeDetailComponent implements OnInit {
  error: any;
  id: string;
  ingredients: any;
  recipe: Recipe;
  userOwnsRecipe: boolean;
  isDeleteModalOpen: boolean;
  deleteModalConfig: ConfirmationModalConfig;
  public loading: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private recipeService: RecipeService,
    private router: Router,
    private shoppingListService: ShoppingListService
  ) {}

  ngOnInit() {

    this.loading = true;

    this.isDeleteModalOpen = false;
    this.deleteModalConfig = {
      mainText: "Are you sure you want to delete this recipe? This cannot be undone.",
      actionRequired: false,
      buttons: [
        {
          text: "Cancel",
          styles: "btn-flat"
        },
        {
          text: "Delete",
          styles: "btn warning"
        },
      ]
    }

    this.activatedRoute.params.subscribe(
      async (params:Params) => {
        this.id = params.id;
        this.error = "";
        this.loading = true;

        try{
          this.recipe = <Recipe> await this.recipeService.getRecipe(this.id).toPromise();
          
          //If recipe doesn't exist, redirect to recipes home
          if (this.recipe === null){
            this.router.navigate(["/recipes"]);
          }else{
            
            //Gets recipe ingredients
            const ingredientsResponse = await this.recipeService.getRecipeIngredients(this.id).toPromise();
            this.ingredients = ingredientsResponse;
            this.loading = false;

            //Sets option to enable Edit and Delete if user is owner
            this.userOwnsRecipe = await this.recipeService.doesRecipeBelongToUser(this.id, this.recipe).toPromise();
          }

        }catch(error){
          this.errorHandling(error);
        }

      }
    );

  }

  onAddToShoppingList() {
    this.shoppingListService.addIngredientsFromRecipe(_.cloneDeep(this.ingredients)).subscribe(
      response => {
        console.log("Ingredients added to shopping list successfully");
      }
    );
  }

  errorHandling(error){
    this.error = error;
    console.log("Error:", error);
  }

  onToggleDeleteModal(){
    this.isDeleteModalOpen = !this.isDeleteModalOpen;    
  }

  onDeleteModalClick(buttonIndex: number){
    switch(buttonIndex){
      case 0:
        this.onToggleDeleteModal();
        break;
      //Confirms that the recipe should be deleted:
      case 1:
        this.recipeService.deleteRecipe(this.id).subscribe(
          response => {
            this.router.navigate(['../../'], {relativeTo: this.activatedRoute});
          }
        );
        break;
    }
  }
  
}
