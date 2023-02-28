import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { UserProfileDto } from '../../_shared/_interfaces/user-profileDto.model';
import { UserManagerService } from '@x01-v1/xl01/auth-service';
import { ProfileService } from '../../_shared/services/profile.service';
import { StateView } from '../../_shared/_interfaces/state-view';

@Component({
  selector: 'app-user-profile-edit',
  templateUrl: './user-profile-edit.component.html',
  styleUrls: ['./user-profile-edit.component.scss'],
})
export class UserProfileEditComponent implements OnInit {
  _errorMgs: string[] = [];
  public showSuccess: boolean = false;

  @Input() public User: UserProfileDto = <UserProfileDto>{
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    email: '',
  };

  @Output()
  onToggleViewState: EventEmitter<StateView> = new EventEmitter();

  constructor(
    private userManagerService: UserManagerService,
    private router: Router,
    private profileServece: ProfileService
  ) {}

  ngOnInit(): void {}

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
