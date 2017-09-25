import { Directive, HostListener, HostBinding} from '@angular/core';

@Directive({
    selector: '[appDropdown]'
})
export class DropdownDirective {
    @HostBinding('class.open') isOpen:boolean = false;

    @HostListener('click') onDropdownToggle(){
        this.isOpen = !this.isOpen;
    }
}