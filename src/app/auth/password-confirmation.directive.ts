import { Directive, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';

//The validator function can be used by itself in reactive forms. Use the directive for template-driven forms
export function passwordConfirmationValidator(control: AbstractControl): {[key: string]: any} {
    //If the values of the two controls are different, return an error object
    return (control.value.password !== control.value['password-confirmation']) ? {'passwordConfirmation': true} : null;
};


@Directive({
    selector: '[appPasswordConfirmation]',
    providers: [{provide: NG_VALIDATORS, useExisting: PasswordConfirmationValidatorDirective, multi: true}]
})
export class PasswordConfirmationValidatorDirective implements Validator {
    validate(control: AbstractControl): {[key: string]: any} {
        return passwordConfirmationValidator(control);
    }
}






// Alternative implementation: If any parameters are needed, use a function that will return the validator function:
// export function passwordConfirmationValidator(equalTo: string): ValidatorFn {
//     return (control: AbstractControl): {[key: string]: any} => {
//         //If the values of the two controls are different, return an error object
//         return (control.value !== control.root.get(equalTo).value) ? {'passwordConfirmation': true} : null;
//     };
// }