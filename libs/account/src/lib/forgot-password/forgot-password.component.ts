import { Component } from '@angular/core';
import { ForgotPasswordDto } from '../_shared/_interfaces/forgot-passwordDto.model';

import { AccountService } from '../_shared/services/account.service';
import { ApiService} from '@wsv2/app-config';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'wsv2-app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {


  public _forgotPass:ForgotPasswordDto=<ForgotPasswordDto>{
    email:'',
    clientURI: this.apiService.ClientUri + 'account/reset-password',

  }
  public _errorMgs: string[] = [];
  public showSuccess= false;
  public _flagButoon = false;
  constructor(
    private repozitory: AccountService,
    private apiService:ApiService
    
    ) {}

  

  public forgotPassword = () => {
    //this.showError = this.showSuccess = false;
   
    this._errorMgs = [];
    this.repozitory.forgotPassword(this._forgotPass).subscribe({
      next: (_) => {
        this.showSuccess = true;
        this._flagButoon = false;
      },
      error: (err: HttpErrorResponse) => {
        this._flagButoon = false;
        console.error(err);
        if (err.status == 400) {
          this._errorMgs.push(' 400 Bad Request');
          if (err.error.errors.Email) //this testing!!
            this._errorMgs.push(err.error.errors.Email);
          else this._errorMgs.push(err.error.errors);
          return;
        }

        this._errorMgs.push(
          'Ошибка соединения с сервером -Сообщиете Администаратору Pесурса'
        );
      },
    });
  };

 
}
