import { Component, OnInit } from '@angular/core';
import { ForgotPasswordDto } from '../_shared/_interfaces/forgot-passwordDto.model';

import { AccountService } from '../_shared/services/account.service';
import { ApiService} from '../_shared/services/route-api.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {


  public _forgotPass:ForgotPasswordDto=<ForgotPasswordDto>{
    email:'',
    clientURI: this.apiService.ClientRoot + 'account/reset-password',

  }
  public _errorMgs: string[] = [];
  public showSuccess: boolean = false;
  public _flagButoon: boolean = false;
  constructor(
    private repozitory: AccountService,
    private apiService:ApiService
    
    ) {}

  ngOnInit(): void {
    // this.forgotPasswordForm =
  }

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

  public onBack() {}
}
