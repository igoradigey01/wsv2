import { Injectable } from '@angular/core';


 const cartSorageKey:{[key:string]:string}={
 
  cartShop:'cart_obj' //корзина 
}
@Injectable({
  providedIn: 'root'
})
export class CarStorage  {  // не реализовано в проекте 13.10.23
  

 
  public get Get(): string | null {
    const obj = localStorage.getItem(cartSorageKey['cartShop']);
    if (obj) return JSON.parse(obj);
    else return null;
  }


  public set Set(obj: string | null) {
    if (obj)
      localStorage.setItem(cartSorageKey['cartShop'], JSON.stringify(obj));
  }
  public remove(): void {
    localStorage.removeItem(cartSorageKey['cartShop']);
  }
}
