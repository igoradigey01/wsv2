import { Directive, Input } from '@angular/core';
import { FormGroup, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import Validation from './must-match.validator';

//https://www.bezkoder.com/angular-13-template-driven-form-validation/
@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[appMatchPassword]',
  standalone: true,
  providers: [{ provide: NG_VALIDATORS, useExisting: MatchPasswordDirective, multi: true }]
})
export class MatchPasswordDirective implements Validator {
  @Input('appMatchPassword') matchPassword: string[] = [];
  validate(formGroup: FormGroup): ValidationErrors | null {
    return Validation.match(this.matchPassword[0], this.matchPassword[1])(formGroup);
  }
}