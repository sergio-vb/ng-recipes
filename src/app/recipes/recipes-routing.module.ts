import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecipeDefaultComponent } from './recipe-default/recipe-default.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { RecipesComponent } from './recipes.component';

import { AuthGuard } from '../auth/auth-guard.service';
import { RoleGuard } from '../auth/role-guard.service';

const routes: Routes = [
    { path: '', component: RecipesComponent, children: [
        { path: '', component: RecipeDefaultComponent},
        // { path: 'new', component: RecipeEditComponent, canActivate: [AuthGuard]},
        { path: 'new', component: RecipeEditComponent},
        { path: ':id/:slug', component: RecipeDetailComponent},
        { path: ':id/:slug/edit', component: RecipeEditComponent, canActivate: [RoleGuard]}
    ]}
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RecipesRoutingModule {}