import { Injectable } from '@angular/core';


const optSorageKey:{[key:string]:string}={
   
    optShopper:'opt_var', //оптовые цены
 
}



@Injectable(
    {
        providedIn: 'root'
    }
)
export class OptShopperStorage{


  
    /** clear all obj in storage */
    public clear():void{
        localStorage.clear();

    }

    public   get Get():string|null{
        
        return  localStorage.getItem( optSorageKey["optShopper"]);;
     }
    public set Set(opt_var_value:string|null){
        if(opt_var_value)
        localStorage.setItem( optSorageKey["optShopper"],opt_var_value);

     }
    public remove():void{
        localStorage.removeItem( optSorageKey["optShopper"]);

    }

    


}