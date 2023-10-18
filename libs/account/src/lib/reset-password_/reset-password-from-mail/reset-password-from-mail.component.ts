import { Component, OnInit  } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import {AccountService} from '../../_shared/services/account.service';
import {ResetPasswordMailDto} from '../../_shared/_interfaces/reset-passwordDto.model';
import { UserManagerService } from '@wsv2/account-service';




//https://metanit.com/sharp/aspnet5/16.6.php
@Component({
  selector: 'app-reset-password-from-mail',
  templateUrl: './reset-password-from-mail.component.html',
  styleUrls: ['./reset-password-from-mail.component.scss']
})
export class ResetPasswordFromMailComponent implements OnInit {
    

  public _confirmPassword:string|undefined;
  public _password:string|undefined;  
  private _token: string|undefined;
  private _email: string|undefined;

 
  public showSuccess: boolean=false;
  public showError: boolean=false;
  _errorMgs: string[] = [];
  

 

  constructor(
    private _authService:AccountService,    
    private _route: ActivatedRoute,
    private _userManager:UserManagerService

  ) { }

  ngOnInit(): void {
    this._token = this._route.snapshot.queryParams['token'];
    this._email = this._route.snapshot.queryParams['email'];
    
   
  }

  

  public submitForm = (resetPasswordForm:NgForm) => {
    this.showError = this.showSuccess = false;
    this._errorMgs=[];

   // const resetPass = { ... resetPasswordForm }; //error

    const resetPassDto: ResetPasswordMailDto = {
      password: this._password || '',
      confirmPassword: this._confirmPassword || '',
      token: this._token||'',
      email: this._email||''
    }

    this._authService.resetPassword( resetPassDto)
    .subscribe({
      next:(_) => {
    //  this._userManager.setInvalidLogin$(true,null);
    this._userManager.SetAccessToken(undefined);
      this.showSuccess = true;
    },
   error: (err: HttpErrorResponse) => {


      console.error(err)

      if(err.status === 401){
        this._errorMgs.push("пользователь не авторизован,войдите на сайт")
        return;
      }

      if ( err.status == 400) {
        
        this._errorMgs.push(' 400 Bad Request');
          this._errorMgs.push(err.error.errors);
        return;
      }

      this._errorMgs.push('Ошибка соединения с сервером -Сообщиете Администаратору Pесурса');
    }})
  }

}
