import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ProductService } from '../_shared/services/product.service';
import {Product} from '@wsv2/app-common'
import { signal } from '@angular/core';

@Component({
  selector: 'wsv2-product',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {

  products = signal<Product[]>([])
  idKatatlog:number|undefined;

  constructor(
    private _repository: ProductService,
    private routeActvate: ActivatedRoute
  ) {
    //   = this.route.snapshot.queryParams['id'];
    routeActvate.params.subscribe((params) => (this.idKatatlog = params['id']));
  }

  ngOnInit(): void {
    //debugger
    if(!this.idKatatlog) return;
    this._repository.Products(this.idKatatlog).subscribe({
      next: (data) => {
        this. products.set( data);
        console.log( this.products);
      },
      error: (err:HttpErrorResponse) => console.error('load katalog err: --' + err.message)
    });
  }
}
