import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecipesComponent } from './recipes/recipes.component';
import { RecipeDefaultComponent } from './recipes/recipe-default/recipe-default.component';
import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';

const appRoutes: Routes = [
  { path: 'recipes', component: RecipesComponent, children: [
    { path: '', component: RecipeDefaultComponent},
    { path: 'detail', component: RecipeDetailComponent},
  ]},
  { path: 'shopping-list', component:   ShoppingListComponent },
  { path: '', redirectTo: 'recipes', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
