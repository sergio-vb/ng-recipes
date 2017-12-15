import { Directive, HostListener, HostBinding} from '@angular/core';

@Directive({
    selector: '[appDropdown]'
})
export class DropdownDirective {
    @HostBinding('class.active') isOpen:boolean = false;

    @HostListener('click') onDropdownToggle(){
        this.isOpen = !this.isOpen;
    }
    @HostListener('mouseleave') onDropdownLeave(){
        //this.isOpen = false;
    }
}