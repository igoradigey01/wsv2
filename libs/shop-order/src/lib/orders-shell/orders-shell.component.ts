import { Component, inject, ChangeDetectionStrategy } from '@angular/core';

import {OrderService} from '../_shared/services/order.service'

@Component({
    selector: 'wsv2-shop-orders-shell',
    imports: [],
    templateUrl: './orders-shell.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./orders-shell.component.scss']
})
export class OrdersShellComponent {

  repozitoryOrder= inject( OrderService);
  josonOrder=JSON.stringify(this.repozitoryOrder.order())
}
