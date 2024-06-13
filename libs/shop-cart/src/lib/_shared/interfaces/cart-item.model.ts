import {Product} from '@wsv2/app-common'

export interface CartItem {
    product: Product;
    quantity: number;
  }