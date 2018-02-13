import { Directive, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, ValidatorFn, Validators } from '@angular/forms';

//The validator function can be used by itself in reactive forms. Use the directive for template-driven forms
export function passwordConfirmationValidator(equalTo: string): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
        //If the values of the two controls are different, return an error object
        return (control.value !== control.root.get(equalTo).value) ? {'passwordConfirmation': true} : null;
    };
}

@Directive({
    selector: '[appPasswordConfirmation]',
    providers: [{provide: NG_VALIDATORS, useExisting: PasswordConfirmationValidatorDirective, multi: true}]
})
export class PasswordConfirmationValidatorDirective implements Validator {
    @Input('appPasswordConfirmation') passwordConfirmation: string;

    validate(control: AbstractControl): {[key: string]: any} {
        return this.passwordConfirmation ? passwordConfirmationValidator(this.passwordConfirmation)(control) : null;
    }
}

