import { Component ,inject} from '@angular/core';
import {OrderService} from '../_shared/services/order.service'
import { CommonModule } from '@angular/common';

@Component({
  selector: 'wsv2-orders-shell',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders-shell.component.html',
  styleUrls: ['./orders-shell.component.scss'],
})
export class OrdersShellComponent {
  repozitoryOrder= inject( OrderService);
  josonOrder=JSON.stringify(this.repozitoryOrder.order())

}
