import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, } from 'rxjs';

import { ManagerServiceModule } from './maneger-service.module';

import { ApiService } from '@wsv2/app-config';
import { RegistrationResponseDto } from '../_interfaces/registration-responseDto.model';
import { UserRegistrationDto } from '../_interfaces/user-registrationDto.model';
import { ForgotPasswordDto } from '../_interfaces/forgot-passwordDto.model';
import { UrlEncoder } from '../class/url-encoder.class';
import { ResetPasswordMailDto } from '../_interfaces/reset-passwordDto.model';
import { ExternalAuthSocialDto } from '../_interfaces/ExternalAuthSocialDto.model';
import { AuthResponseDto } from '../_interfaces/AuthResponseDto.model';

@Injectable({
  providedIn: ManagerServiceModule,
})
export class AccountService {


  public get ClientUri() {
    return this.url.ClientUri;
  }

  public get ClientId(){
    return this.url.ClientId;
  }

  public get VkId(){
    return this.url.VkId;
  }

  constructor(private http: HttpClient, private url: ApiService) {}

  /** Get token login pass */
  public login = (credentials: string): Observable<any> => {
    // debugger
    this.url.Controller = 'Account';
    this.url.Action = 'Login';
    this.url.ID = null;

    //  console.log('login-credentials = '+credentials);
    return this.http.post(this.url.AuthUrl, credentials, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }), withCredentials: true   // использовать  cookie для refreshToken
    });
  };

 

  public googleLogin = (credentials: ExternalAuthSocialDto) => {
    this.url.Controller = 'Account';
    this.url.Action = 'GoogleExternalLogin';
    this.url.ID = null;

     console.log('login-credentials = '+JSON.stringify(credentials));
    return this.http.post<AuthResponseDto>(this.url.AuthUrl, credentials, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }), withCredentials: true   // использовать  cookie
    });
  };

  public vkLogin = (credentials: ExternalAuthSocialDto) => {
    this.url.Controller = 'Account';
    this.url.Action = 'VKExternalLogin';
    this.url.ID = null;
     //debugger
    //new Response(fd).text().then(console.log);
        
   //console.log('vkLogin-credentials = '+JSON.stringify( credentials) );
   console.log('login-credentials = '+credentials);
    return this.http.post<AuthResponseDto>(this.url.AuthUrl, credentials, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }), withCredentials: true   // использовать  cookie
    });
  };

  public registerUser = (body: UserRegistrationDto) => {
    this.url.Controller = 'Account';
    this.url.Action = 'Registration'; //this._action;
    this.url.ID = null;

    return this.http.post<RegistrationResponseDto>(this.url.AuthUrl, body);
  };

  public confirmEmail = (token: string, email: string) => {
    this.url.Controller = 'Account';
    this.url.Action = 'EmailConfirmation'; //this._action;
    this.url.ID = null;

    let params = new HttpParams({ encoder: new UrlEncoder() });
    params = params.append('token', token);
    params = params.append('email', email);

    return this.http.get(this.url.AuthUrl, { params: params });
  };

  public forgotPassword = (body: ForgotPasswordDto) => {
    // debugger
    this.url.Controller = 'Account';
    this.url.Action = 'ForgotPassword';
    this.url.ID = null;

    return this.http.post(this.url.AuthUrl, body);
  };

  public resetPassword = (body: ResetPasswordMailDto) => {
    this.url.Controller = 'Account';
    this.url.Action = 'ResetPasswordMail';
    this.url.ID = null;

    return this.http.post(this.url.AuthUrl, body);
  };
}
