import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { ShoppingListComponent } from './shopping-list.component';
import { ShoppingListEditComponent } from './shopping-list-edit/shopping-list-edit.component';


@NgModule({
    declarations:[
        ShoppingListComponent,
        ShoppingListEditComponent,
    ],
    imports:[
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        SharedModule
    ]
})
export class ShoppingListModule{}