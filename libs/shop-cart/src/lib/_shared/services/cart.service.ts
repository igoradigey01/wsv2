import { Injectable, computed, signal } from '@angular/core';
import { Product } from '@wsv2/app-common';
import { CartItem } from '../interfaces/cart-item.model';
import { ApiService } from '@wsv2/app-config';
// eslint-disable-next-line @nx/enforce-module-boundaries
//import {OrderService} from '@wsv2/shop-orders'

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private state = signal<CartItem[]>([]);

  cartItems = computed(() => this.state());

  // Total up the extended price for each item
  totalPrice = computed(() =>
    this.cartItems().reduce(
      (a, b) => a + b.quantity * Number(b.product.cost_total),
      0
    )
  );

  public get ServerUrl(): string {
    return this._repositoryApi.ServerUri;
  }

  constructor(
    private _repositoryApi: ApiService
  ) //  private _repozitoryOrder:OrderService
  {}

  addToCart(product: Product): void {
    // debugger

    let index = -1;
    const updatedTodoList = this.state().map((item, i: number) => {
      if (item.product.id === product.id) {
        index = i;
        return (item.quantity = item.quantity + 1);
      }else
      return item;
    });

    if (index === -1) {
      this.state.update((d) => [...d, { product, quantity: 1 }]);
    } else this.state.update(() => [...(updatedTodoList as CartItem[])]);
  }

  removeFromCart(cartItem: CartItem): void {
    // Update the cart with a new array containing
    // all but the filtered out deleted item

    //let index = -1;

    const updatedTodoList = this.state().map((item) => {
      if (item.product.id === cartItem.product.id) return;
       // index = i;
        //return item.quantity=item.quantity+1;
        
      return item;
    });

    this.state.update(() => [...(updatedTodoList as CartItem[])]);
  }
  //убрать
  putInCart(cartItem: CartItem) {
    
    //let index = -1;


    const updatedTodoList = this.state().map((item) => {
      if (item.product.id === cartItem.product.id) {
        //index = i;
        if(item.quantity>1)
        return (item.quantity = item.quantity - 1);
        else return;          //ничего не возвращаем
      }else
      return item;
    });
    this.state.update(() => [...(updatedTodoList as CartItem[])]);
  }
}
