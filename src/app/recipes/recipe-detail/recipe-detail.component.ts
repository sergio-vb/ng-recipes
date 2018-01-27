import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Ingredient } from '../../shared/ingredient.model';
import { ModalConfig } from '../../shared/modal-config.model';
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
  ingredients: Ingredient[];
  recipe: Recipe;
  userOwnsRecipe: boolean;
  isConfirmationOpen: boolean;
  modalConfig: ModalConfig;

  constructor(
    private activatedRoute: ActivatedRoute,
    private recipeService: RecipeService,
    private router: Router,
    private shoppingListService: ShoppingListService
  ) {}

  ngOnInit() {

    this.isConfirmationOpen = false;

    this.modalConfig = {
      mainText: "Are you sure you want to delete this recipe? This cannot be undone.",
      leftButtonText: "Cancel",
      rightButtonText: "Right",
      leftButtonStyles: "btn-flat",
      rightButtonStyles: "btn warning"
    }

    this.activatedRoute.params.subscribe(
      async (params:Params) => {
        this.id = params.id;
        this.error = "";

        try{
          this.recipe = <Recipe> await this.recipeService.getRecipe(this.id).first().toPromise();
          
          //If recipe doesn't exist, redirect to recipes home
          if (this.recipe === null){
            this.router.navigate(["/recipes"]);
          }else{
            
            //Gets recipe ingredients
            const ingredientsResponse = await this.recipeService.getRecipeIngredients(this.id).first().toPromise();
            this.ingredients = [];
            for (let id in ingredientsResponse){
              this.ingredients.push(ingredientsResponse[id]);
            }

            //Sets option to enable Edit and Delete if user is owner
            this.userOwnsRecipe = await this.recipeService.doesRecipeBelongToUser(this.id, this.recipe).first().toPromise(); //Only interested in first value, not on-going subscription
          }

        }catch(error){
          this.errorHandling(error);
        }

      }
    );

  }

  onAddToShoppingList() {
    //this.shoppingListService.addIngredients(this.recipe.ingredients);
  }

  onDeleteRecipe(){
    this.recipeService.deleteRecipe(this.id).subscribe(
      response => {
        this.router.navigate(['../../'], {relativeTo: this.activatedRoute});
      }
    );
  }

  errorHandling(error){
    this.error = error;
    console.log("Error:", error);
  }

  onToggleConfirmation(){
    this.isConfirmationOpen = !this.isConfirmationOpen;;
  }
  
}
