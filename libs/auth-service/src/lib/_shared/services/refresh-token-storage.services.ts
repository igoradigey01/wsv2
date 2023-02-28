import { Injectable } from '@angular/core';
import {Storage} from '../_class/storage.class';
import { authSorageKey } from './access-token-storage.services';




@Injectable({
    providedIn: 'root'
}
)
export class RefreshTokenStorage implements Storage{

    constructor() {}
    /** clear all obj in storage */
    public clear():void{
        localStorage.clear();

    }
    /**get access token */
    public   get Get():string|null{
        
        return  localStorage.getItem(authSorageKey["refreshToken"]);;
     }

     /**set access token */
    public set Set(refresh_token:string|null){
        if(refresh_token)
        localStorage.setItem(authSorageKey["refreshToken"],refresh_token);
        


     }
    public remove():void{
        localStorage.removeItem(authSorageKey["accessToken"]);

    }

  
}