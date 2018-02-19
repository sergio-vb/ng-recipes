import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CanDeactivateGuard } from './can-deactivate-guard.service';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { DropdownDirective } from './dropdown.directive';
import { LoaderComponent } from './loader/loader.component';
import { ObjectKeys } from './object-keys.pipe';

@NgModule({
    declarations: [
        ConfirmationModalComponent,
        DropdownDirective, 
        LoaderComponent,
        ObjectKeys
    ],
    imports: [
        CommonModule
    ],
    exports: [
        CommonModule, /* common directives, ngClass, ngFor, ngIf */
        ConfirmationModalComponent,
        DropdownDirective,
        LoaderComponent,
        ObjectKeys
    ]
})
export class SharedModule {}