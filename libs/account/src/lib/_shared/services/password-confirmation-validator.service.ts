import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import {ManagerServiceModule} from './maneger-service.module'

@Injectable({
  providedIn: ManagerServiceModule
})
export class PasswordConfirmationValidatorService {

  constructor() { }

  public validateConfirmPassword = (passwordControl: AbstractControl): ValidatorFn => {
    return (confirmationControl: AbstractControl) : { [key: string]: boolean } | null => {

      const confirmValue = confirmationControl.value;
      const passwordValue = passwordControl.value;

      if (confirmValue === '') {
          return null;
      }

      if (confirmValue !== passwordValue) {
          return  { mustMatch: true }
      }

      return null;
    };
  }
}
