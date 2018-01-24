import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DropdownDirective } from './dropdown.directive';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';

@NgModule({
    declarations: [DropdownDirective, ConfirmationModalComponent],
    imports: [
        CommonModule
    ],
    exports: [
        CommonModule, /* common directives, ngClass, ngFor, ngIf */
        DropdownDirective,
        ConfirmationModalComponent
    ]
})
export class SharedModule {}