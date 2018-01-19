import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecipesComponent } from './recipes.component';
import { RecipeDefaultComponent } from './recipe-default/recipe-default.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { AuthGuard } from '../auth/auth-guard.service';

const routes: Routes = [
    { path: '', component: RecipesComponent, children: [
        { path: '', component: RecipeDefaultComponent},
        // { path: 'new', component: RecipeEditComponent, canActivate: [AuthGuard]},
        { path: 'new', component: RecipeEditComponent},
        { path: ':id/:slug', component: RecipeDetailComponent},
        { path: ':id/:slug/edit', component: RecipeEditComponent, canActivate: [AuthGuard]}
    ]}
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RecipesRoutingModule {}