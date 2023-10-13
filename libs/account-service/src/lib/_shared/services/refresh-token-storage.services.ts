import { Injectable } from '@angular/core';


const refreshSorageKey:{[key:string]:string}={
   
    refreshToken:'refresh_token',
   
}


@Injectable({
    providedIn: 'root'
}
)
export class RefreshTokenStorage {


    /**get access token */
    public   get Get():string|null{
        
        return  localStorage.getItem(refreshSorageKey["refreshToken"]);;
     }

     /**set access token */
    public set Set(refresh_token:string|null){
        if(refresh_token)
        localStorage.setItem(refreshSorageKey["refreshToken"],refresh_token);
        


     }
    public remove():void{
        localStorage.removeItem(refreshSorageKey["accessToken"]);

    }

  
}