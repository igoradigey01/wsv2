import { Component, OnInit , OnDestroy} from '@angular/core';
import { Router ,ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserManagerService } from '@wsv2/account-service';
import {EnvironmentService} from '@wsv2/app-config'
import { HttpUrlEncodingCodec, HttpErrorResponse } from '@angular/common/http'
import {VkLoginWidgetService} from '../_shared/services/vk-login-widger.service'
import {UserVkDto} from '../_shared/_interfaces/user-vkDto.model'


@Component({
  selector: '@wsv2-app-auth-callback-vk',
  templateUrl: './auth-callback-vk.component.html',
  styleUrls: ['./auth-callback-vk.component.scss'],
})
export class AuthCallbackVkComponent implements OnInit , OnDestroy {

  _errorMgs: string[] = [];
  private _subscriptions: Subscription[] = [];   
  public user:UserVkDto=<UserVkDto>{}
  private _codec = new HttpUrlEncodingCodec();


  constructor(
    private repozitory: VkLoginWidgetService,
    private _userManager: UserManagerService,
    private route: ActivatedRoute,
    private router: Router,
    private envir:EnvironmentService

  ) {
   // ---response identity server -----
  //   https://mh-01.ru/account/auth-callback-vk?
  //   uid=662269659
  //  &first_name=%D0%A6%D1%8B%D0%B3%D0%B0%D0%BD%D0%BA%D0%BE%D0%B2
  //  &last_name=%D0%98%D0%B3%D0%BE%D1%80%D1%8C
  //  &photo=https:%2F%2Fsun2-17.userapi.com%2Fs%2Fv1%2Fig2%2FjStvezSSKrGjMqQF2BXinnDyi6N7TY_6_0l61U6eDBXxviet9MQl5qPZfqcq5Lqa-rVXVHqM81xgl1DfBxt8R8Ta.jpg%3Fsize%3D400x400%26amp;quality%3D96%26amp;crop%3D35,0,630,630%26amp;ava%3D1
  //   &photo_rec=https:%2F%2Fsun2-17.userapi.com%2Fs%2Fv1%2Fig2%2F6Gaw21HXcl2P9F0H0uKmpCuabGAY66NH5rP07EuEpmrtL2uwFcM_BihfSSLvALx6qEfZ7xkAZllLiLr_gwu8jEkD.jpg%3Fsize%3D100x100%26amp;quality%3D96%26amp;crop%3D98,63,504,504%26amp;ava%3D1
  //  &hash=ed305a609272a76691a0828b287f089a

  // После авторизации метод VK.Widgets.Auth возвращает данные о пользователе в виде GET-параметров URL при использовании authUrl или в виде параметров функции при использовании onAuth. Возвращаются следующие поля:       
  // uid (integer) — идентификатор пользователя;       
  // first_name (string) — имя;       
  // last_name (string) — фамилия;       
  // photo (string) — URL фотографии профиля пользователя шириной 200px;       
  // photo_rec (string) — URL фотографии профиля пользователя шириной 50px;       
  // hash (string) — служебный параметр, необходимый для проверки авторизации на удаленной стороне.       
  // Для проверки авторизации вы можете использовать полученный параметр hash, сравнив его с md5 подписью от app_id+user_id+secret_key, например md5(667481942537fTanpCrNSeuGPbA4ENCo).    
   }

  ngOnInit(): void {
   // debugger
    this.user.provider='VK';  
    this.user.idUser = this.route.snapshot.queryParams['uid'];
    this.user.idApp=this.repozitory.IdAPP;
    this.user.first_name = this._codec.decodeValue( this.route.snapshot.queryParams['first_name']);
    this.user.last_name=this._codec.decodeValue( this.route.snapshot.queryParams['last_name']);  
    const photo_rec= this._codec.decodeValue( this.route.snapshot.queryParams['photo_rec']);
    this.user.photo_rec_url=photo_rec?photo_rec:"";
    this.user.hash=this.route.snapshot.queryParams['hash'];
    this.user.spaId=this.envir.clientId;


    const subLogin=  this.repozitory.CheckUser(this.user).subscribe(
      {
        next: (d:any) => {
        
         // this._userManager.setInvalidLogin$(false, d.access_token);
         this._userManager.SetAccessToken( d.access_token);
        // console.log("login_in-"+d.access_token)
         
          this.router.navigateByUrl('');
        },
        error:(err: HttpErrorResponse) => {
       
         // this._userManager.setInvalidLogin$(true, null);
         this._userManager.SetAccessToken(undefined);
           
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
  
  
         
  
          this._errorMgs.push('Ошибка соединения с сервером -Сообщиете Администаратору Pесурса');
        }
       
      }
     )

     this._subscriptions.push(subLogin);
    
  }


  ngOnDestroy() {
    this._subscriptions.forEach((s) => s.unsubscribe());
  }
}
