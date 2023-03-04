import { Injectable } from '@angular/core';
import { Storage } from '../_class/storage.class';
import { authSorageKey } from './access-token-storage.services';


@Injectable({
  providedIn: 'root'
})
export class CarStorage implements Storage {
  constructor() {}
  /** clear all obj in storage */
  public clear(): void {
    localStorage.clear();
  }
  /**get obj carShop */
  public get Get(): string | null {
    let obj = localStorage.getItem(authSorageKey['carShop']);
    if (obj) return JSON.parse(obj);
    else return null;
  }

  /**set obj carShop */
  public set Set(obj: string | null) {
    if (obj)
      localStorage.setItem(authSorageKey['carShop'], JSON.stringify(obj));
  }
  public remove(): void {
    localStorage.removeItem(authSorageKey['carShop']);
  }
}
