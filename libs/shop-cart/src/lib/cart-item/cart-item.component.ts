import { Component, Input, computed, signal } from '@angular/core';
import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CartItem } from '../_shared/interfaces/cart-item.model';
import { CartService } from '../_shared/services/cart.service';

@Component({
  selector: 'sw-cart-item',
  standalone: true,
  imports: [DecimalPipe, FormsModule, NgFor, NgIf],
  templateUrl: './cart-item.component.html'
})
export class CartItemComponent {


  // Use a setter to emit whenever a new item is set
  _item!: CartItem;
  get item(): CartItem {
    return this._item;
  }
  @Input() set item(item: CartItem) {
    this._item = item;
    this.cartItem.set(item);
  }

  // Hard-coded quantity
  // These could instead come from an inventory system
  qtyArr = signal([1, 2, 3, 4, 5, 6, 7, 8]);

  // Cart item signal
  cartItem = signal(this.item);

  // When the item changes, recalculate the extended price
  exPrice = computed(() =>
    this.cartItem().quantity * Number(this.cartItem().product.cost_total));

  constructor(private cartService: CartService) { }

  onQuantitySelected(quantity: number): void {
    // Update the quantity in the item
    this.cartService.updateInCart(this.cartItem(), Number(quantity));
  }

  onRemove(): void {
    this.cartService.removeFromCart(this.cartItem());
  }
}
