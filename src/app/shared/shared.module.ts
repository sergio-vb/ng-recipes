import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DropdownDirective } from './dropdown.directive';
import { OptionalActionModalComponent } from './optional-action-modal/optional-action-modal.component';
import { ObjectKeys } from './object-keys.pipe';
import { RequiredActionModalComponent } from './required-action-modal/required-action-modal.component';
import { CanDeactivateGuard } from './can-deactivate-guard.service';

@NgModule({
    declarations: [
        DropdownDirective, 
        OptionalActionModalComponent,
        ObjectKeys,
        RequiredActionModalComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        CommonModule, /* common directives, ngClass, ngFor, ngIf */
        DropdownDirective,
        OptionalActionModalComponent,
        RequiredActionModalComponent,
        ObjectKeys
    ]
})
export class SharedModule {}