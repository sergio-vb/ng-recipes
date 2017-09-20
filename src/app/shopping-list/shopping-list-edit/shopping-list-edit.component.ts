import { Component, OnInit, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';

import { Ingredient } from '../../shared/ingredient.model';

@Component({
  selector: 'app-shopping-list-edit',
  templateUrl: './shopping-list-edit.component.html',
  styleUrls: ['./shopping-list-edit.component.css']
})
export class ShoppingListEditComponent implements OnInit {

  @ViewChild('nameInput') nameInputRef:ElementRef;
  @ViewChild('amountInput') amountInputRef:ElementRef;
  @Output() ingredientAdded = new EventEmitter<{name:string, amount:number}>();

  constructor() { }

  ngOnInit() {
  }

  onAddItem(){
    const newIngredient = new Ingredient(
      this.nameInputRef.nativeElement.value, 
      this.amountInputRef.nativeElement.value
    );
    this.ingredientAdded.emit(newIngredient);
  }
}
