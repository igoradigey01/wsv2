import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ManagerServiceModule } from './maneger-service.module';
import { ApiService } from './route-api.service';
import {UserProfileDto} from '../_interfaces/user-profileDto.model'
import {UserManagerService} from '@wsv2/account-service'
import {ResetPasswordProfileDto} from '../_interfaces/reset-password-profileDto.model'






@Injectable({
  providedIn: ManagerServiceModule
})
export class ProfileService {
  
  
  

  constructor(
    private http: HttpClient,
    private userManager:UserManagerService,
    private url: ApiService
  ) {
    
    
  }

  public GetUser=(): Observable<UserProfileDto>=>{
    this.url.Controller='Profile';
    this.url.Action = 'GetUser';
    this.url.ID=null;

   // console.log("getUser token-"+this.userManager.AccessToken);

    let headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
      Authorization: 'Bearer ' + this.userManager.AccessToken,
    });

    return this.http.get<UserProfileDto>(this.url.UrlAuth, {
      headers
    }); 
  }


  public Update=(credentials: string): Observable<any> =>{
    this.url.Controller='Profile';
    this.url.Action = 'EditUser';
    this.url.ID=null;
    let headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.userManager.AccessToken,
    });
    return this.http.post(this.url.UrlAuth, credentials, { headers });
  }

  public ResetPassword = (body: ResetPasswordProfileDto) => {
    this.url.Controller = 'Profile';
    this.url.Action = 'ResetPasswordProfile';
    this.url.ID = null;
    let headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.userManager.AccessToken,
    });

    return this.http.post(this.url.UrlAuth, body,{ headers });
  };

  public Delete=(id: string): Observable<any> =>{
    this.url.Controller = 'Profile';
    this.url.Action = 'Delete';
    this.url.ID=null;
    let headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
      Authorization: 'Bearer ' + this.userManager.AccessToken,
    });
    let url = this.url.UrlAuth + '/' + id;
    console.log("url delete profile-"+url);
    return this.http.delete(url, { headers });
  }
}
