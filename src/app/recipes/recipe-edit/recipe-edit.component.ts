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
  editMode = false;
  id: string;
  recipeForm: FormGroup;
  public loadingDetails: boolean;
  public loadingIngredients: boolean;
  public uploadedImageBase64: any;
  private uploadedImageFile: File;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private recipeService: RecipeService,
    private router: Router
  ) {}

  ngOnInit() {
    this.activatedRoute.params
      .subscribe(
        (params: Params) => {
          this.id = params.id;
          this.editMode = params.id !== undefined;
          this.loadingDetails = true;
          this.loadingIngredients = true;
          this.initForm();
        }
      );
  }

  onAddIngredient(){
    (<FormArray>this.recipeForm.get('ingredients')).push(new FormGroup({
      'name': new FormControl(null, [Validators.required, this.validateDuplicates.bind(this)]),
      'amount': new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*[\.]*[0-9]*$/)])
    }));
  }

  validateDuplicates(formControl: FormControl){
    const controlIndex = this.findIndexOfFormControl(formControl);
    
    //Finds any ingredients with a name that matches the value of the formControl being validated, but excluding itself
    const duplicates = this.recipeForm.value.ingredients.filter(
      (ingredient, i) => (ingredient.name === formControl.value) && (i !== controlIndex)
    );
    //Returns the error object if any duplicate is found, otherwise return null to indicate that field is valid:
    return (duplicates.length > 0) ? {
      validateDuplicates: {
        valid: false
      }
    } : null;
  }

  //Finds the index of a formControl inside the ingredients FormArray
  findIndexOfFormControl(formControl: FormControl){
    const ingredientControls = (<FormArray>this.recipeForm.get('ingredients')).controls;
    let index = -1;
    ingredientControls.map( (ingredient: FormGroup, i) => {
      if (ingredient.controls.name === formControl){
        index = i;
      }
    });
    return index;
  }

  private initForm(){

    //Default values
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipePreparation = '';
    let recipeIngredients = new FormArray([]);

    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'imagePath': new FormControl(recipeImagePath, Validators.required),
      'description': new FormControl(recipeDescription, Validators.required),
      'preparation': new FormControl(recipePreparation, Validators.required),
      'ingredients': recipeIngredients
    });

    //If editing an existing recipe, overwrite default values
    if (this.editMode){
      
      this.recipeService.getRecipe(this.id).subscribe(
        (recipe: Recipe) => {
          this.recipeForm.controls['name'].setValue(recipe.name);
          this.recipeForm.controls['imagePath'].setValue(recipe.imagePath);
          this.recipeForm.controls['description'].setValue(recipe.description);
          this.recipeForm.controls['preparation'].setValue(recipe.preparation);
          this.loadingDetails = false;
        }
      );
      this.recipeService.getRecipeIngredients(this.id).subscribe(
        (ingredients) => {
          for (let id in ingredients){
            recipeIngredients.push(new FormGroup({
              'name': new FormControl(ingredients[id].name, [Validators.required,, this.validateDuplicates.bind(this)]),
              'amount': new FormControl(ingredients[id].amount, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*[\.]*[0-9]*$/)]),
            }));
          }
          this.loadingIngredients = false;
        }
      );
    }

  }

  async onSubmit(){
    const formValues = this.recipeForm.value;
    const { userId } = await this.authService.getLatestAuthState().toPromise(); //Only interested in first value, not on-going subscription
    
    /*
    Use the recipeService to upload the image to firebase storage, returning the image url
    Use the newly-acquired url to save the recipe as usual
    */

    console.log("File to be uploaded:", this.uploadedImageFile);
    const imageUrl = this.recipeService.uploadImage(this.uploadedImageFile);

    // const recipe = new Recipe(
    //   userId,
    //   formValues.name, 
    //   this.recipeService.slugify(formValues.name),
    //   formValues.description, 
    //   formValues.preparation,
    //   formValues.imagePath
    // );

    // //Converts array to normalized object
    // const ingredients = formValues.ingredients.reduce((obj, current) => {
    //   obj[current.name] = current;
    //   return obj;
    // }, {});

    // if (this.editMode){
    //   this.recipeService.updateRecipe(this.id, recipe, ingredients).subscribe(
    //     response => {
    //       console.log("Update recipe response:", response);
    //       this.router.navigate(['../'], {relativeTo: this.activatedRoute});
    //     }
    //   );
    // }else{
    //   this.recipeService.addRecipe(recipe, ingredients).subscribe( 
    //     response => {
    //       console.log("Add recipe response:", response);
    //       this.router.navigate(['../'], {relativeTo: this.activatedRoute});
    //     }
    //   );
    // }  
  }

  onCancel(){
    this.router.navigate(['../'], {relativeTo: this.activatedRoute});
  }

  onDeleteIngredient(index:number){
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  handleFileSelect(evt){
    console.log("Image Event:", evt);
    const files = evt.target.files;
    
    if (files && files.length) {
      console.log("File:", files[0]);
      this.uploadedImageFile = files[0];

      //Loads the image into an <img> tag to display a preview to the user:
      const reader = new FileReader();
      reader.onload = function(){
        this.uploadedImageBase64 = reader.result;
      }.bind(this);
      reader.readAsDataURL(files[0]);
    }
  }

  /*
  handleFileSelect(evt): void {
    const files = evt.target.files;
    const file = files[0];

    if (files && file) {
      const reader = new FileReader();
      reader.onload = this._handleReaderLoaded.bind(this);
      reader.readAsBinaryString(file);
    }
  }

  _handleReaderLoaded(readerEvt): void {
    const binaryString = readerEvt.target.result;
    this.img.nativeElement.src = BASE64 + btoa(binaryString);
    this.user.avatar = this.img.nativeElement.src;
  }
  */
  
}
