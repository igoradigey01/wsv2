import { Injectable, signal } from '@angular/core';
import { Product } from '@wsv2/app-common';

import { OrderItem } from '../interfaces/order-item.model';
import {Order} from '../interfaces/order.model'
import { ApiService } from '@wsv2/app-config';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  
  private _order=<Order>{
    id:-1,adress:"",date:"",isСompleted:false,orderItems:<OrderItem[]>([]),total:-1}
  // Manage state with signals
  order = signal<Order>(this._order);

  

  public get ServerUrl(): string {
    return this._repositoryApi.ServerUri;
  }

  constructor(private _repositoryApi: ApiService) {}

 

  CreateOrder(orderItems:OrderItem[],total:number): void {
    this.order.mutate(
      (d)=>{
        d.date=new Date().toDateString();
        d.orderItems=orderItems;
        d.total=total;
      }
    )
    // debugger

 
  }


  
}
