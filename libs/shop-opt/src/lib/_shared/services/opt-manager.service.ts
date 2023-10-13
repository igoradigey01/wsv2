import { Injectable } from '@angular/core';
import {OptShopperStorage} from './opt-shopper-storage.services'
import { BehaviorSubject } from 'rxjs';




@Injectable({
  providedIn: 'root',
})
export class OptManagerService {


    private _invalidOptShopper$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(true);


    constructor(
        private optShopperStorage: OptShopperStorage,
       
      ) {}

     /** Client subscribe() for _invalidLogin chenged; !! ngOnDestroy()-- unsubscribe !!  */
  public get InvalidOptShopper$(): BehaviorSubject<boolean> {
    const opt = this.optShopperStorage.Get;
    if (opt) {
      if (opt === 'opt-1') {
        this._invalidOptShopper$.next(false);
      }
    }
    return this._invalidOptShopper$;
  }


   /** set value for  _invalidLogin ; defauld -- true */
   public setInvalidOptShopper$(i: boolean, opt: string | null) {
    //
    this._invalidOptShopper$.next(i);
    if (!i) {
      this.optShopperStorage.Set = opt;
    } else {
      this.optShopperStorage.remove();
    }
  }

}