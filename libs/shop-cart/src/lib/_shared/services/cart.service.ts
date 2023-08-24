import { Injectable, computed, signal } from '@angular/core';
import { Product } from '@wsv2/app-common';
import { CartItem } from '../interfaces/cart-item.model';
import { ApiService } from '@wsv2/app-config';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  // Manage state with signals
  cartItems = signal<CartItem[]>([]);

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

  constructor(private _repositoryApi: ApiService) {}

  /*  // налог , доставка - включить в итоговую стомость
     // Delivery is free if spending more than 100,000 credits
     deliveryFee = computed(() => this.subTotal() < 100000 ? 999 : 0);
   
     // Tax could be based on shipping address zip code
     tax = computed(() => Math.round(this.subTotal() * 10.75) / 100);
   
     // Total price
     totalPrice = computed(() => this.subTotal() + this.deliveryFee() + this.tax()); 
     */

  addToCart(product: Product): void {
    // debugger

    let index = -1;
    this.cartItems.mutate((d) => {
      d.map((item, i) => {
        if (item.product.id === product.id) {
          index = i;
        }
      });
    });

    if (index === -1) {
      this.cartItems.mutate((items: CartItem[]) =>
        items.push({ product, quantity: 1 })
      );
    } else {
      // Already in the cart, so increase the quantity by 1
      this.cartItems.mutate(
        (items: CartItem[]) =>
          (items[index] = { product, quantity: items[index].quantity + 1 })
      );
    }
  }

  removeFromCart(cartItem: CartItem): void {
    // Update the cart with a new array containing
    // all but the filtered out deleted item

    let index = -1;
    this.cartItems.mutate((d) => {
      d.map((item, i) => {
        if (item.product.id === cartItem.product.id) {
          index = i;
        }
      });
      if(index!==-1)
      delete d[index]
    });

  
  }
   //убрать
  putInCart(cartItem: CartItem) {
    // Update the cart with a new array containing
    // the updated item and all other original items
    let index = -1;
    this.cartItems.mutate((d) => {
      d.map((item, i) => {
        if (item.product.id === cartItem.product.id) {
          index = i;
        }
      });
      if(index!==-1)
      if(d[index].quantity>1)
       d[index].quantity=d[index].quantity-1
      else delete d[index]
    });
  }
}
