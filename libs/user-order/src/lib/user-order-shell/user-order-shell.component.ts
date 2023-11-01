import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'wsv2-user-order-shell',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-order-shell.component.html',
  styleUrls: ['./user-order-shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserOrderShellComponent {}
