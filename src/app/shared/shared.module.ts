import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DropdownDirective } from './dropdown.directive';
import { ObjectKeys } from './object-keys.pipe';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { CanDeactivateGuard } from './can-deactivate-guard.service';

@NgModule({
    declarations: [
        DropdownDirective, 
        ObjectKeys,
        ConfirmationModalComponent
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