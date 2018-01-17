import { Ingredient } from '../shared/ingredient.model';

export class Recipe {
  constructor(
    public ownerId: string,
    public name: string,
    public slug: string,
    public description: string,
    public imagePath: string
  ) {}
}
/* Note: When creating a class model, defining the properties inside a constructor can make it easier to create instances, by not having to specify the property names when using an object literal:

//If Recipe was defined with a constructor that receives all properties:
const recipe1 = new Recipe(
  this.authService.getUserId(),
  formValues.name, 
  this.recipeService.slugify(formValues.name),
  formValues.description, 
  formValues.imagePath
);

//If Recipe was defined by just declaring the class properties, but without a constructor:
const recipe2: Recipe = {
  ownerId: this.authService.getUserId(),
  name: formValues.name,
  slug: this.recipeService.slugify(formValues.name),
  description: formValues.description, 
  imagePath: formValues.imagePath
};

Also not using new will cause it to not be considered an instance of Recipe, with instanceOf:
recipe1 instanceof Recipe //true
recipe2 instanceof Recipe //false

If we want to use new with a class that didn't use a constructor, with have to use "let" with an object literal, or const but then assigning properties separately:

let recipe2 = new Recipe();
recipe2 = { //recipe2 instanceof Recipe will be false, since it's being reassigned
  ownerId: this.authService.getUserId(),
  name: formValues.name,
  slug: this.recipeService.slugify(formValues.name),
  description: formValues.description, 
  imagePath: formValues.imagePath
};

//This has the drawback that you can miss to declare a property that should be present and no error will be shown.
const recipe2 = new Recipe()
recipe2.ownerId = this.authService.getUserId();
recipe2.name = formValues.name;
recipe2.slug = this.recipeService.slugify(formValues.name);
recipe2.description = formValues.description; 
recipe2.imagePath = formValues.imagePath;
    
*/