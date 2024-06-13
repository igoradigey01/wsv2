import { Component ,inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import {OrderService} from '../_shared/services/order.service'

@Component({
  selector: 'wsv2-shop-orders-shell',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders-shell.component.html',
  styleUrls: ['./orders-shell.component.scss'],
})
export class OrdersShellComponent {

  repozitoryOrder= inject( OrderService);
  josonOrder=JSON.stringify(this.repozitoryOrder.order())
}
