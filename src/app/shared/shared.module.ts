import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DropdownDirective } from './dropdown.directive';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { ObjectKeys } from './object-keys.pipe';

@NgModule({
    declarations: [
        DropdownDirective, 
        ConfirmationModalComponent,
        ObjectKeys
    ],
    imports: [
        CommonModule
    ],
    exports: [
        CommonModule, /* common directives, ngClass, ngFor, ngIf */
        DropdownDirective,
        ConfirmationModalComponent,
        ObjectKeys
    ]
})
export class SharedModule {}