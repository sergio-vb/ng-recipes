import { Directive, HostListener } from '@angular/core';

@Directive({
    selector: '[appDropdown]'
})
export class DropdownDirective {
     @HostListener('click') onDropdownToggle(){
        console.log("Dropdown clicked.");
     }
}