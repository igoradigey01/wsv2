import { Component, OnInit,OnDestroy } from '@angular/core';
import { Router ,ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { UserManagerService } from '@wsv2/account-service';
import {TelegramLoginWidgetService} from '../_shared/services/telegram-login-widget.servise'
import {UserTelegramDto} from '../_shared/_interfaces/user-telegramDto.model'
import {EnvironmentService} from '@wsv2/app-config'

//https://core.telegram.org/widgets/login
//https://medium.com/@alexandershogenov/%D0%B4%D0%B5%D0%BB%D0%B0%D0%B5%D0%BC-oauth-%D0%B0%D0%B2%D1%82%D0%BE%D1%80%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8E-telegram-%D0%BD%D0%B0-%D1%81%D0%B2%D0%BE%D1%91%D0%BC-%D1%81%D0%B0%D0%B9%D1%82%D0%B5-74d0d63095b0
@Component({
  selector: 'wsv2-auth-callback-telegram',
  templateUrl: './auth-callback-telegram.component.html',
  styleUrls: ['./auth-callback-telegram.component.scss'],
})
export class AuthCallbackTelegramComponent implements OnInit , OnDestroy {

  _errorMgs: string[] = [];
  private _subscriptions: Subscription[] = [];   
  public user:UserTelegramDto=<UserTelegramDto>{}

  constructor(
    private repozitory: TelegramLoginWidgetService,
    private _userManager: UserManagerService,
    private environment:EnvironmentService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.user.id = this.route.snapshot.queryParams['id'];
    this.user.firstName = this.route.snapshot.queryParams['first_name'];
    this.user.userName=this.route.snapshot.queryParams['username'];
    this.user.authDate=this.route.snapshot.queryParams['auth_date'];
    this.user.hash=this.route.snapshot.queryParams['hash'];
    this.user.spaId=this.environment.clientId;
    const subLogin=  this.repozitory.CheckUser(this.user).subscribe(
      {
        next: (d:any) => {
        
          this._userManager.SetAccessToken( d.access_token);
        //  console.log("login_in-"+d.access_token)
         
          this.router.navigateByUrl('');
        },
        error:(err: HttpErrorResponse) => {
          let body="";
          //this._userManager.setInvalidLogin$(true, null);
          this._userManager.SetAccessToken( undefined);
           console.error(err);  
           if(err.status === 401){
            this._errorMgs.push("пользователь не авторизован,войдите на сайт");
            this._errorMgs.push(err.error);
            return;
          }   
          if ( err.status == 400) {
            
            this._errorMgs.push(' 400 Bad Request');
            this._errorMgs.push(err.error);
  
            return;
  
            //  body = 'Не верный логин или пароль';
          }
  
  
          body =
            'Ошибка соединения с сервером -Сообщиете Администаратору Pесурса';
  
          this._errorMgs.push(body);
        }
       
      }
     )

     this._subscriptions.push(subLogin);
    
  }
  ngOnDestroy() {
    this._subscriptions.forEach((s) => s.unsubscribe());
  }
}
