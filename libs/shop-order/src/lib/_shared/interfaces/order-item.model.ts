import {Product} from '@wsv2/app-common'

export interface OrderItem {
    product: Product;
    quantity: number;
  }