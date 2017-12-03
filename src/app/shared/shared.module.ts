import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DropdownDirective } from './dropdown.directive';

@NgModule({
    declarations: [DropdownDirective],
    exports: [
        CommonModule, /* common directives, ngClass, ngFor, ngIf */
        DropdownDirective
    ]
})
export class SharedModule {}