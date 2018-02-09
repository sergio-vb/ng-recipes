import { Component, Input, Output, OnInit, OnDestroy, OnChanges, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { Ingredient } from '../../shared/ingredient.model';
import { OptionalActionModalConfig } from '../../shared/optional-action-modal-config.model';

import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-list-edit',
  templateUrl: './shopping-list-edit.component.html',
  styleUrls: ['./shopping-list-edit.component.scss']
})
export class ShoppingListEditComponent implements OnInit, OnChanges {
  @Input() editedItemKey: string;
  @Output() editedItemKeyChange = new EventEmitter<string>();
  editMode = false;
  editedItem: Ingredient;
  ingredientForm: FormGroup;
  isConfirmationOpen: boolean;
  modalConfig: OptionalActionModalConfig;
  newIngredient: Ingredient;

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
    this.newIngredient = new Ingredient(
      this.ingredientForm.controls.ingredientName.value,
      this.ingredientForm.controls.ingredientAmount.value
    );
    if (this.editMode){
      this.shoppingListService.updateLocalIngredient(this.editedItemKey, this.newIngredient);
      this.resetEditMode();
    }else{

      try{
        this.shoppingListService.addLocalIngredient(this.newIngredient);
        this.resetEditMode();
      }catch(e){
        this.isConfirmationOpen = true;
      }
    }
    
  }

  onConfirmAddToExisting(){
    //Gets the ingredient that has the same name as the new ingredient, and adds their amounts together
    this.newIngredient.amount += this.shoppingListService.getLocalIngredient(this.newIngredient.name).amount;
    
    this.shoppingListService.updateLocalIngredient(this.editedItemKey, this.newIngredient);
    this.resetEditMode();
    this.isConfirmationOpen = false;
  }

  onClearForm(){
    this.resetEditMode();
  }
  onDeleteIngredient(){
    this.shoppingListService.deleteLocalIngredient(this.editedItemKey);
    this.resetEditMode();
  }

  resetEditMode(){
    this.ingredientForm.reset();
    this.editMode = false;
    this.editedItemKey = "";
    this.editedItemKeyChange.emit(this.editedItemKey);
    this.editedItem = null;
  }

  onToggleConfirmation(){
    this.isConfirmationOpen = !this.isConfirmationOpen;;
  }
}
