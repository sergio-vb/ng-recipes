import { Component, Input, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { Ingredient } from '../../shared/ingredient.model';
import { ModalConfig } from '../../shared/modal-config.model';

import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-list-edit',
  templateUrl: './shopping-list-edit.component.html',
  styleUrls: ['./shopping-list-edit.component.scss']
})
export class ShoppingListEditComponent implements OnInit, OnChanges {
  @Input() editedItemKey: string;
  editMode = false;
  editedItem: Ingredient;
  ingredientForm: FormGroup;
  isConfirmationOpen: boolean;
  modalConfig: ModalConfig;

  constructor(private shoppingListService: ShoppingListService) {}

  ngOnInit() {
    this.ingredientForm = new FormGroup({
      ingredientName: new FormControl(null, [Validators.required]),
      ingredientAmount: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[1-9]+[0-9]*$/)
      ])
    });

    this.isConfirmationOpen = false;
    this.modalConfig = {
      mainText: "This ingredient already exists on your shopping list. Do you want to add the entered amount to the existing listing?",
      leftButtonText: "Cancel",
      rightButtonText: "Confirm",
      leftButtonStyles: "btn-flat",
      rightButtonStyles: "btn"
    }

  }

  ngOnChanges(){
    if (this.editedItemKey){
      this.editMode = true;
      this.editedItem = this.shoppingListService.getLocalIngredient(this.editedItemKey);
      this.ingredientForm.setValue({
        ingredientName: this.editedItem.name,
        ingredientAmount: this.editedItem.amount
      });
    }
  }

  onAddItem() {
    const newIngredient = new Ingredient(
      this.ingredientForm.controls.ingredientName.value,
      this.ingredientForm.controls.ingredientAmount.value
    );
    if (this.editMode){
      this.shoppingListService.updateLocalIngredient(this.editedItemKey, newIngredient);
    }else{

      try{
        this.shoppingListService.addLocalIngredient(newIngredient);
      }catch(e){
        this.isConfirmationOpen = true;
      }
    }
    this.resetEditMode();
  }
  onConfirmUpdateExisting(){
    const newIngredient = new Ingredient(
      this.ingredientForm.controls.ingredientName.value,
      this.ingredientForm.controls.ingredientAmount.value
    );
    this.shoppingListService.updateLocalIngredient(this.editedItemKey, newIngredient);
  }

  onClearForm(){
    this.resetEditMode();
  }
  onDeleteIngredient(){
    //this.shoppingListService.deleteLocalIngredient(this.editedItemIndex);
    this.resetEditMode();
  }

  resetEditMode(){
    this.ingredientForm.reset();
    this.editMode = false;
    this.editedItemKey = "";
    this.editedItem = null;
  }

  onToggleConfirmation(){
    this.isConfirmationOpen = !this.isConfirmationOpen;;
  }
}
