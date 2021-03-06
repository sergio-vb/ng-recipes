import { Component, Input, Output, OnInit, OnDestroy, OnChanges, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { Ingredient } from '../../shared/ingredient.model';
import { ConfirmationModalConfig } from '../../shared/confirmation-modal-config.model';

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
  isConfirmationModalOpen: boolean;
  modalConfig: ConfirmationModalConfig;
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

    this.isConfirmationModalOpen = false;
    this.modalConfig = {
      mainText: "This ingredient already exists on your shopping list. Do you want to add the entered amount to the existing listing?",
      actionRequired: false,
      buttons: [
        {
          text: "Cancel",
          styles: "btn-flat"
        },
        {
          text: "Confirm",
          styles: "btn"
        },
      ]
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
        this.isConfirmationModalOpen = true;
      }
    }
    
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

  onConfirmationModalClick(buttonIndex: number){
    switch (buttonIndex){
      case 0:
        this.isConfirmationModalOpen = !this.isConfirmationModalOpen;
        break;
      //Confirms that the ingredient should be added to the existing ingredient with the same name:
      case 1:
        this.newIngredient.amount += this.shoppingListService.getLocalIngredient(this.newIngredient.name).amount;
        this.shoppingListService.updateLocalIngredient(this.editedItemKey, this.newIngredient);
        this.resetEditMode();
        this.isConfirmationModalOpen = false;
        break;
    }
  }
}
