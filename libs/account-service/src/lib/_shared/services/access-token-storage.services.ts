import { Injectable } from '@angular/core';



 const accessSorageKey:{[key:string]:string}={
    accessToken:'access_token',
   
}

@Injectable({
    providedIn: 'root'
}
)
export class AccessTokenStorage {

   
    /** clear all obj in storage */
    public clear():void{
        localStorage.clear();

    }
    /**get access token */
    public   get Get():string|null{
        
        return  localStorage.getItem(accessSorageKey["accessToken"]);;
     }

     /**set access token */
    public set Set(access_token:string|null){
        if(access_token)
        localStorage.setItem(accessSorageKey["accessToken"],access_token);
        


     }
    public remove():void{
        localStorage.removeItem(accessSorageKey["accessToken"]);

    }

  
}