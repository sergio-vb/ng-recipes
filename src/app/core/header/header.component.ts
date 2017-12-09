import { Component } from '@angular/core';
import { RecipeService } from '../../recipes/recipe.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent{
  constructor(
    private recipeService: RecipeService,
    private authService: AuthService
  ){}

  onSaveData(){
    this.recipeService.storeRecipes();
  }
  onFetchData(){
    this.recipeService.fetchRecipes();
  }
  onLogout(){
    this.authService.logoutUser();
  }
}
