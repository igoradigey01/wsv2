import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {UserVkDto} from '../_interfaces/user-vkDto.model'
import { ApiService } from '@wsv2/app-config';
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

 private VK_WIDGET_VERSION = 168;


  script: ScriptModel = <ScriptModel>{
    name: 'vk_widget',
    src: `https://vk.com/js/api/openapi.js?${this.VK_WIDGET_VERSION}`,
    loaded: false,
  };

  constructor(
    private http: HttpClient,   
    private url: ApiService
  ) { }

  public loadWidgetScript(): void {
    // Complete if already loaded
     if (this.script.loaded) {
      return;
    } else {
      // Add the script

      // Load the script
      //debugger
     const elemetParent =  document.getElementById('x01-v2-VK-login-widget')
  if( elemetParent){
     const div = document.createElement("div");
       div.id="vk_auth";
       elemetParent.parentNode?.appendChild(div)
;

       //.appendChild(scriptElement1);
       //elemet.a
     //  if(elemet) elemet.parentNode?.childNodes(div)

      // document.getElementsByTagName('x01-v1-VK-login-widget')[0].appendChild(div);

      const scriptElement1 = document.createElement('script');
     // debugger
      scriptElement1.type = 'text/javascript';
      scriptElement1.src = this.script.src;
      scriptElement1.charset='windows-1251';      
     // scriptElement1.async;

     

      scriptElement1.onload = () => {
       // this.script.loaded = true;
      };

      scriptElement1.onerror = (error: any) => {
        this.script.loaded =false;
        console.error("Couldn't load script openapi.js" + error);
      };
       
      elemetParent.parentNode?.appendChild(scriptElement1)
    
      const scriptElement2=document.createElement('script');
      scriptElement2.type = 'text/javascript';
      scriptElement2.text=`VK.init({ apiId: ${this.url.VkId} });`

      scriptElement2.onload = () => {
       // this.script.loaded = true;
      };

      scriptElement2.onerror = (error: any) => {
        this.script.loaded =false;
        console.error("Couldn't load script VK.init" + error);
      };
      
      elemetParent.parentNode?.appendChild(scriptElement2)
      //document.getElementsByTagName('x01-v1-VK-login-widget')[0].appendChild(scriptElement2);
       

      const scriptElement3=document.createElement('script');
      scriptElement3.type = 'text/javascript';
      scriptElement3.text=`VK.Widgets.Auth("vk_auth", {width: 200, authUrl: "${this.url.ClientUri}account/auth-callback-vk"});`

      scriptElement3.onload = () => {
        this.script.loaded = true;
      };

      scriptElement3.onerror = (error: any) => {
        this.script.loaded =false;
        console.error("Couldn't load script VK.init" + error);
      };

      
      
      elemetParent.parentNode?.appendChild(scriptElement3)
     
     // document.getElementsByTagName('x01-v1-VK-login-widget')[0].appendChild(scriptElement3);
    }}
  }

   public CheckUser(user:UserVkDto){

    this.url.Controller='Account';
    this.url.Action = 'VKExternalLogin';
    this.url.ID=null;
   const headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + '',
    });
    //var credentials=JSON.stringify(user);
    return this.http.post(this.url.AuthUrl, user, { headers });

   }

   public get IdAPP(){
    return this.url.VkId;
   }
}
