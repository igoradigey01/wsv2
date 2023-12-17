import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
//import {ProductType} from '../_shared/interfaces/product_type.model'
import {MatTableModule} from '@angular/material/table';
import {ProductTypeService} from '../_shared/services/product_type.service'

@Component({
  selector: 'wsv2-product-type-shell',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule
  ],
  templateUrl: './product-type-shell.component.html',
  styleUrls: ['./product-type-shell.component.scss'],
})
export class ProductTypeShellComponent {

  public displayedColumns: string[] = ['position', 'name', 'hidden'];

  public product_types = this.repository.ProductTypes; 

  public message=this.repository.Message;
   
 
  

  constructor(
    private repository: ProductTypeService
    ) {

      repository.ClearMessage();
    }

 
}
