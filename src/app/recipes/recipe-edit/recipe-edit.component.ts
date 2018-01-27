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
  id: string;
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
          this.id = params.id;
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

    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'imagePath': new FormControl(recipeImagePath, Validators.required),
      'description': new FormControl(recipeDescription, Validators.required),
      'ingredients': recipeIngredients
    });

    //If editing an existing recipe, overwrite default values
    if (this.editMode){
      
      this.recipeService.getRecipe(this.id).subscribe(
        (recipe: Recipe) => {
          this.recipeForm.controls['name'].setValue(recipe.name);
          this.recipeForm.controls['imagePath'].setValue(recipe.imagePath);
          this.recipeForm.controls['description'].setValue(recipe.description);
        }
      );
      this.recipeService.getRecipeIngredients(this.id).subscribe(
        (ingredients) => {
          for (let id in ingredients){
            recipeIngredients.push(new FormGroup({
              'name': new FormControl(ingredients[id].name, Validators.required),
              'amount': new FormControl(ingredients[id].amount, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
            }));
          }
        }
      );
    }

  }

  async onSubmit(){
    const formValues = this.recipeForm.value;
    const { userId } = await this.authService.getAuthState().first().toPromise(); //Only interested in first value, not on-going subscription
    
    const recipe = new Recipe(
      userId,
      formValues.name, 
      this.recipeService.slugify(formValues.name),
      formValues.description, 
      formValues.imagePath
    );

    //Converts array to normalized object
    const ingredients = formValues.ingredients.reduce((obj, current) => {
      obj[current.name] = current;
      return obj;
    }, {});

    if (this.editMode){
      this.recipeService.updateRecipe(this.id, recipe, ingredients).subscribe(
        response => {
          console.log("Update recipe response:", response);
          this.router.navigate(['../'], {relativeTo: this.activatedRoute});
        }
      );
    }else{
      this.recipeService.addRecipe(recipe, ingredients).subscribe( 
        response => {
          console.log("Add recipe response:", response);
          this.router.navigate(['../'], {relativeTo: this.activatedRoute});
        }
      );
    }    
  }

  onCancel(){
    this.router.navigate(['../'], {relativeTo: this.activatedRoute});
  }

  onDeleteIngredient(index:number){
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }
}
