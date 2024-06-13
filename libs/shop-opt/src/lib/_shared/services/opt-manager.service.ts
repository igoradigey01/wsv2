import { Injectable, signal } from '@angular/core';
import { OptShopperStorage } from './opt-shopper-storage.services';


@Injectable({
  providedIn: 'root',
})
export class OptManagerService {

  public flagOpt=signal(false);


  

  constructor(private optShopperStorage: OptShopperStorage) {}

  public checkFlag() {
    const opt = this.optShopperStorage.Get;
    if (opt) {
      if (opt === 'opt1') {
        this.flagOpt.update(()=>true);
        return;
      }
    }
    this.flagOpt.update(()=>false);
   // this.flagOpt.set(false);
  }

  public setInvalidOpt() {
    this.optShopperStorage.remove();
    this.flagOpt.update(()=>false);
    //this.flagOpt.set(false);
  }
  public setValidOpt() {
    this.optShopperStorage.Set = 'opt1';
    this.flagOpt.update(()=>true);
   // this.flagOpt.set(true);
  }
}
