import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {UserTelegramDto} from '../_interfaces/user-telegramDto.model'
import { ApiService } from './route-api.service';
import { ManagerServiceModule } from './maneger-service.module';

export interface ScriptModel {
  name: string;
  src: string;
  loaded: boolean;
}

@Injectable({
  providedIn: ManagerServiceModule
})
export class VkLoginWidgetService {

 private TELEGRAM_WIDGET_VERSION = 19;

  script: ScriptModel = <ScriptModel>{
    name: 'vk_widget',
    src: 'https://telegram.org/js/telegram-widget.js?${TELEGRAM_WIDGET_VERSION}',
    loaded: false,
  };

  constructor(
    private http: HttpClient,   
    private url: ApiService
  ) { }

  public loadWidgetScript(): void {
    // Complete if already loaded
    if (this.script.loaded) {
    } else {
      // Add the script

      // Load the script
      let scriptElement = document.createElement('script');
      scriptElement.type = 'text/javascript';
      scriptElement.src = this.script.src;

      scriptElement.async;
      scriptElement.setAttribute('data-telegram-login', 'x_01_bot');
      scriptElement.setAttribute('data-size', 'large');
      scriptElement.setAttribute(
        'data-auth-url',
        'https://xl-01.ru/account/auth-callback-telegram'
      );
      scriptElement.setAttribute('data-request-access', 'write');

      scriptElement.onload = () => {
        this.script.loaded = true;
      };

      scriptElement.onerror = (error: any) => {
        console.error("Couldn't load script telegram_widget" + error);
      };

      document.getElementsByTagName('x01-v1-telegram-login-widget')[0].appendChild(scriptElement);
    }
  }

   public CheckUser(user:UserTelegramDto){

    this.url.Controller='Account';
    this.url.Action = 'TelegramExternalLogin';
    this.url.ID=null;
    let headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + '',
    });
    var credentials=JSON.stringify(user);
    return this.http.post(this.url.AuthUrl, credentials, { headers });

   }
}
