import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

import { Recipe } from '../recipe.model';
import { Ingredient } from '../../shared/ingredient.model';

import { RecipeService } from '../recipe.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.scss']
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode = false;
  recipeForm: FormGroup;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private recipeService: RecipeService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.activatedRoute.params
      .subscribe(
        (params: Params) => {
          this.id = +params.id;
          this.editMode = params.id !== undefined;
          this.initForm();
        }
      );
  }

  onAddIngredient(){
    (<FormArray>this.recipeForm.get('ingredients')).push(new FormGroup({
      'name': new FormControl(null, Validators.required),
      'amount': new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
    }));
  }

  private initForm(){

    //Default values
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipeIngredients = new FormArray([]);

    //If editing an existing recipe, overwrite default values
    if (this.editMode){
      const recipe = this.recipeService.getRecipe(this.id);
      
      recipeName = recipe.name;
      recipeImagePath = recipe.imagePath;
      recipeDescription = recipe.description;

      //Check if the recipe has ingredients (they are optional) and push them to the corresponding FormArray
      // if (recipe.ingredients){
      //   for (let ingredient of recipe.ingredients){
      //     recipeIngredients.push(new FormGroup({
      //       'name': new FormControl(ingredient.name, Validators.required),
      //       'amount': new FormControl(ingredient.amount, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
      //     }));
      //   }
      // }
    }

    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'imagePath': new FormControl(recipeImagePath, Validators.required),
      'description': new FormControl(recipeDescription, Validators.required),
      'ingredients': recipeIngredients
    });
  }

  onSubmit(){
    const formValues = this.recipeForm.value;
    const recipe = new Recipe(
      this.authService.getUserId(),
      formValues.name, 
      formValues.description, 
      formValues.imagePath
    );

    if (this.editMode){
      this.recipeService.updateRecipe(this.id, this.recipeForm.value);
    }else{
      console.log("Will add recipe:", recipe);
      this.recipeService.addRecipe(recipe);
    }
    this.router.navigate(['../'], {relativeTo: this.activatedRoute});    
  }

  onCancel(){
    this.router.navigate(['../'], {relativeTo: this.activatedRoute});
  }

  onDeleteIngredient(index:number){
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }
}
