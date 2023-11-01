import { Component,  Output, EventEmitter, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { UserProfileDto } from '../_shared/interfaces/user-profileDto.model';
import { UserManagerService } from '@wsv2/account-service';
import { ProfileService } from '../_shared/services/profile.service';
import { StateView } from '@wsv2/app-common';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'wsv2-user-profile-edit',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './user-profile-edit.component.html',
  styleUrls: ['./user-profile-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileEditComponent  {
  _errorMgs: string[] = [];
  public showSuccess = false;

  @Input() public User: UserProfileDto = <UserProfileDto>{
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    email: '',
  };

  @Output()
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  onToggleViewState: EventEmitter<StateView> = new EventEmitter();

  constructor(
    private userManagerService: UserManagerService,
    private router: Router,
    private profileServece: ProfileService
  ) {}



  submitForm(registerForm: NgForm) {
    this._errorMgs = [];
    this.showSuccess=false;

    const credentials = JSON.stringify(registerForm.value);

    this.profileServece.Update(credentials).subscribe({
      next: (data) => {
        this.showSuccess=true;
        this.onToggleViewState.next(StateView.default);
      },
      error: (err: HttpErrorResponse) => {
        //   this._errorMgs=error.error;// error может быть и 400 и 500 -- если err===400 то можно setValidationErrors(this.form, error)
        console.error(err);
        this.showSuccess=false;
        if (err.status === 401) {
          this._errorMgs.push("пользователь не авторизован,войдите на сайт")
          return;
        }
        if (err.status === 400) {
          this._errorMgs.push(' 400 Bad Request');
          this._errorMgs.push(err.error);
          return;
        }

        this._errorMgs.push(
          'Ошибка соединения с сервером -Сообщиете Администаратору ресурса'
        );
      },
    });
  }

  public onBack(){

    this.onToggleViewState.next(StateView.default);

  }
}
