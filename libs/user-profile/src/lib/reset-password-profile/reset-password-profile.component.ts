import { Component, OnInit,Input,Output, EventEmitter, ChangeDetectionStrategy, } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import { FormsModule } from '@angular/forms';


import { HttpErrorResponse } from '@angular/common/http';
import {StateView} from '@wsv2/app-common'

import { ProfileService} from '../_shared/services/profile.service';
import { ResetPasswordProfileDto } from '../_shared/interfaces/reset-password-profileDto.model';
import { UserManagerService } from '@wsv2/account-service';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { MatchPasswordDirective } from '../_shared/_helpers/must-match.directive';

@Component({
  
  selector: 'wsv2-reset-password-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    FormsModule, 
    RouterModule,
    MatchPasswordDirective
   
  ],
  templateUrl: './reset-password-profile.component.html',
  styleUrls: ['./reset-password-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordProfileComponent implements OnInit {
 
 

  public resetPassDto: ResetPasswordProfileDto = <ResetPasswordProfileDto>{
    confirmPassword: '',
    newPassword: '',
    oldPassword: '',
    email: ''
  };

  public showSuccess = false;

  _errorMgs: string[] = [];

  @Input() public Email: string |undefined;
  @Output()
     // eslint-disable-next-line @angular-eslint/no-output-on-prefix
     onToggleViewState:EventEmitter<StateView> = new EventEmitter()

  constructor(
    private repozitory: ProfileService,   
    private userManager: UserManagerService
  ) {}

  ngOnInit(): void {
    
      this.resetPassDto.email=this.Email||'';
    
  }

  public submitForm = () => {
    
    this._errorMgs = [];

   
    //const resetPass = JSON.stringify(resetPasswordForm.value);
     // resetPass===this.resetPassDto

     console.log("resetPasswordForm--"+JSON.stringify(this.resetPassDto))
    this.repozitory.ResetPassword(this.resetPassDto).subscribe({
      next: () => {
        //this.userManager.setInvalidLogin$(true, null);
        this.userManager.SetAccessToken( undefined);
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
