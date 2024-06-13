import { Injectable, signal } from '@angular/core';

//import { Product } from '@wsv2/app-common';

import { OrderDetail } from '../interfaces/order-detail.model';
import { Order } from '../interfaces/order.model';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ApiService ,CompanyInformationService} from '@wsv2/app-config';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  

private _order=<Order>{
  id:0,
  orderNO:'',
  ownerId:this._repositoryApi.ClientId,
  ownerPhone:this._repositoryCompanyInfo.company_phone,
  createdAt:new Date( Date.parse('0001-01-01T00:00:00')),
  closedAt:new Date( Date.parse('0001-01-01T00:00:00')),
  orderAdress:'',
  orderPickup:false,
  orderNote:'',
  customerFullName:'',
  customerId:'',
  customerPhone:'',
  customerMail:'',
  payment_total:0,
  total:0,
  paymentStateId:1,
  orderStateId:1,
  orderItems:[]

};

  // Manage state with signals
  order = signal<Order>(this._order);

  public get ServerUrl(): string {
    return this._repositoryApi.ServerUri;
  }

  constructor(
    private _repositoryApi: ApiService,
    private _repositoryCompanyInfo:CompanyInformationService
    ) {}

  CreateOrder(orderItems: OrderDetail[], total: number): void {
    /* this.order.mutate((d) => {
     // d.date = new Date().toDateString();
      d.orderItems = orderItems;
      d.total = total;
    }); */
    // debugger
    this.order.update(d=>({...d,date:new Date().toDateString(),orderItems:orderItems,total:total}));
  }
}
