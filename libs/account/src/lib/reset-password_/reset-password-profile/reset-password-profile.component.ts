import { Component, OnInit,Input,Output, EventEmitter, } from '@angular/core';
import { NgForm } from '@angular/forms';

import { HttpErrorResponse } from '@angular/common/http';
import {StateView} from '../../_shared/_interfaces/state-view'

import { ProfileService} from '../../_shared/services/profile.service';
import { ResetPasswordProfileDto } from '../../_shared/_interfaces/reset-password-profileDto.model';
import { UserManagerService } from '@wsv2/account-service';

@Component({
  selector: 'x01-v1-reset-password-profile',
  templateUrl: './reset-password-profile.component.html',
  styleUrls: ['./reset-password-profile.component.scss'],
})
export class ResetPasswordProfileComponent implements OnInit {
 
 

  public resetPassDto: ResetPasswordProfileDto = <ResetPasswordProfileDto>{
    confirmPassword: '',
    newPassword: '',
    oldPassword: '',
    email: ''
  };

  public showSuccess: boolean = false;

  _errorMgs: string[] = [];

  @Input() public Email: string |undefined;
  @Output()
     onToggleViewState:EventEmitter<StateView> = new EventEmitter()

  constructor(
    private repozitory: ProfileService,   
    private userManager: UserManagerService
  ) {}

  ngOnInit(): void {
    
      this.resetPassDto.email=this.Email||'';
    
  }

  public submitForm = (resetPasswordForm: NgForm) => {
    
    this._errorMgs = [];

   
    //const resetPass = JSON.stringify(resetPasswordForm.value);
     // resetPass===this.resetPassDto

     console.log("resetPasswordForm--"+JSON.stringify(this.resetPassDto))
    this.repozitory.ResetPassword(this.resetPassDto).subscribe({
      next: (_) => {
        this.userManager.setInvalidLogin$(true, null);
        this.showSuccess = true;
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);

        if (err.status === 401) {
          this._errorMgs.push('пользователь не авторизован,войдите на сайт');
          return;
        }

        if (err.status == 400) {
          this._errorMgs.push(' 400 Bad Request');
           this._errorMgs.push( err.error.errors ); //правильно -см asp net controller
          return;
        }

        this._errorMgs.push(
          'Ошибка соединения с сервером -Сообщиете Администаратору Pесурса'
        );
      },
    });
  };

  public onBack(){

    this.onToggleViewState.next(StateView.default);

  }
}
