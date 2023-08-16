import { Injectable, computed, signal } from '@angular/core';
import {  Product } from '@wsv2/app-common';
import { CartItem } from '../interfaces/cart-item.model';

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

  /*  // налог , доставка - включить в итоговую стомость
     // Delivery is free if spending more than 100,000 credits
     deliveryFee = computed(() => this.subTotal() < 100000 ? 999 : 0);
   
     // Tax could be based on shipping address zip code
     tax = computed(() => Math.round(this.subTotal() * 10.75) / 100);
   
     // Total price
     totalPrice = computed(() => this.subTotal() + this.deliveryFee() + this.tax()); 
     */

  addToCart(product: Product): void {
    const index = this.cartItems().findIndex((item: CartItem) => {
      if (product.guid && item.product.guid) {
        item.product.guid === product.guid;
      } else {
        item.product.id === product.id;
      }
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
    this.cartItems.update((items: CartItem[]) =>
      items.filter((item) => {
        if (cartItem.product.guid && item.product.guid) {
          item.product.guid !== cartItem.product.guid;
        } else {
          item.product.id !== cartItem.product.id;
        }
      })
    );
  }

  updateInCart(cartItem: CartItem, quantity: number) {
    // Update the cart with a new array containing
    // the updated item and all other original items
    this.cartItems.update((items: CartItem[]) =>
      items.map((item) =>{

        let flag=false

        if (cartItem.product.guid && item.product.guid) {
          if(   item.product.guid === cartItem.product.guid)
           flag=true;
          } 
        else {
           if( item.product.id === cartItem.product.id)
           flag=true
          }

         if(flag) return <CartItem>{product: cartItem.product, quantity}
         else return item;
        
    
    }
        
      )
    );
  }
}
