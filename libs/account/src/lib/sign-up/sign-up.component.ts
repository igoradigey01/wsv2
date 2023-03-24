import { Component, OnInit , OnDestroy} from '@angular/core';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { UserRegistrationDto } from '../_shared/_interfaces/user-registrationDto.model';
import { AccountService } from '../_shared/services/account.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit , OnDestroy  {

  private _subscriptions: Subscription[] = [];
  public showSuccess: boolean = false;

  public _user: UserRegistrationDto = {
    clientURI: this._authService.ClientUri + 'account/email-confirmation',
    firstName: '',
    lastName: '',
    address: '',
    phone: '',
    confirmPassword: '',
    email: '',
    password: '',
  };

  // _successfulSave: boolean = false; // пользователь успешно сохранен
  _errorMgs: string[] = [];

  constructor(private _authService: AccountService) {}

  ngOnInit(): void {}

  ngOnDestroy() {
    this._subscriptions.forEach((s) => s.unsubscribe());
  }

  onReset(form: NgForm): void {
    form.reset();
  }

  public submitForm = (registerForm: NgForm) => {
    this._errorMgs = [];

    // const credentials = JSON.stringify(registerForm.value);
    // this._errorMgs.length=0;

   var sub=  this._authService.registerUser(this._user).subscribe({
      next: (_) => {
        console.log('Successful registration');
        this.showSuccess = true;
      },
      error: (err: HttpErrorResponse) => {
        this.showSuccess = false;
        console.error(err);
        
        if (err.status === 400) {
          this._errorMgs.push(' 400 Bad Request');
          this._errorMgs.push(err.error.errors);
          return;
        }

        this._errorMgs.push(
          'Ошибка соединения с сервером -Сообщиете Администаратору Pесурса'
        );
      },
    });

    this._subscriptions.push(sub);
  };
}
