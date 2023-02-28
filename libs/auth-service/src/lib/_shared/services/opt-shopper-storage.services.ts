import { Injectable } from '@angular/core';
import {Storage} from '../_class/storage.class';
import {authSorageKey} from './access-token-storage.services';


@Injectable(
    {
        providedIn: 'root'
    }
)
export class OptShopperStorage implements Storage{


    constructor() {}
    /** clear all obj in storage */
    public clear():void{
        localStorage.clear();

    }

    public   get Get():string|null{
        
        return  localStorage.getItem(authSorageKey["optShopper"]);;
     }
    public set Set(opt_var_value:string|null){
        if(opt_var_value)
        localStorage.setItem(authSorageKey["optShopper"],opt_var_value);

     }
    public remove():void{
        localStorage.removeItem(authSorageKey["optShopper"]);

    }

    


}