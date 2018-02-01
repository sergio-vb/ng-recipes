import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DropdownDirective } from './dropdown.directive';
import { OptionalActionModalComponent } from './optional-action-modal/optional-action-modal.component';
import { ObjectKeys } from './object-keys.pipe';

@NgModule({
    declarations: [
        DropdownDirective, 
        OptionalActionModalComponent,
        ObjectKeys
    ],
    imports: [
        CommonModule
    ],
    exports: [
        CommonModule, /* common directives, ngClass, ngFor, ngIf */
        DropdownDirective,
        OptionalActionModalComponent,
        ObjectKeys
    ]
})
export class SharedModule {}