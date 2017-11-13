import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-list-edit',
  templateUrl: './shopping-list-edit.component.html',
  styleUrls: ['./shopping-list-edit.component.css']
})
export class ShoppingListEditComponent implements OnInit, OnDestroy {
  ingredientForm: FormGroup;
  editingSubscription: Subscription;
  editMode = false;
  editedItemIndex: number;
  editedItem: Ingredient;

  constructor(private shoppingListService: ShoppingListService) {}

  ngOnInit() {
    this.ingredientForm = new FormGroup({
      ingredientName: new FormControl(null, [Validators.required]),
      ingredientAmount: new FormControl(null, [
        Validators.required,
        Validators.pattern('^[1-9]+[0-9]*$')
      ])
    });

    this.editingSubscription = this.shoppingListService.startedEditing.subscribe(
      (index: number) => {
        this.editMode = true;
        this.editedItemIndex = index;
        this.editedItem = this.shoppingListService.getIngredient(index);
        console.log(this.editedItem);
        this.ingredientForm.setValue({
          ingredientName: this.editedItem.name,
          ingredientAmount: this.editedItem.amount
        });
      }
    );
  }

  onAddItem() {
    const newIngredient = new Ingredient(
      this.ingredientForm.controls.ingredientName.value,
      this.ingredientForm.controls.ingredientAmount.value
    );
    if (this.editMode){
      this.shoppingListService.updateIngredient(this.editedItemIndex, newIngredient);
    }else{
      this.shoppingListService.addIngredient(newIngredient);
    }
    this.resetEditMode();
  }

  onClearForm(){
    this.resetEditMode();
  }
  onDeleteIngredient(){
    this.shoppingListService.deleteIngredient(this.editedItemIndex);
    this.resetEditMode();
  }

  resetEditMode(){
    this.ingredientForm.reset();
    this.editMode = false;
    this.editedItemIndex = null;
    this.editedItem = null;
  }
  ngOnDestroy() {
    this.editingSubscription.unsubscribe();
  }
}
