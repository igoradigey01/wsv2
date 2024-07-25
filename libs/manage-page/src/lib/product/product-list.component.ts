import { Component, Output, EventEmitter, Signal, signal, Input, computed } from "@angular/core";
import {MatIconModule} from '@angular/material/icon';

//import { MatButtonModule } from "@angular/material/button";
import { CommonModule } from '@angular/common';

import { MatButtonToggleModule } from "@angular/material/button-toggle";
import {  Product } from "@wsv2/app-common";
import { EmitData, StateView } from "./product-shell.component";

@Component({
  selector: 'wsv2-product-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonToggleModule,
    MatIconModule

  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent {


  private state:Signal<Product[]> = signal<Product[]>([]);
  
  private _product_type_of_clientId=1; 
  
   @Input({required:true}) set Items(items:Signal<Product[]>) {
    
     this.state=items;
   }


  @Output() public productChange = new EventEmitter<EmitData>();


  public Products=  computed(()=>  this.state());




  changePosition(action: string, item: Product) {
    // debugger
    if (action === 'edit')
      this.productChange.emit(<EmitData>{
        product: item,
        stateView: StateView.edit,
      });
    if (action === 'delete')
      this.productChange.emit(<EmitData>{
        product: item,
        stateView: StateView.delete,
      });
  }

  addPosition() {
    // debugger
    this.productChange.emit(<EmitData>{
      product: <Product>{
        id: -1,
        guid: '',
        img_guids: undefined,
        hidden: false,
        ownerId: '',
        product_typeId: -1,
        title: '',

        subCatalogId: -1,
        subCatalogName: undefined,

        colorId: -1,
        colorName: undefined,
        brandId: -1,
        brandName: undefined,
        articleId: -1,
        articleName: undefined,

        position: 0,
        inStock: false, //есть  на складе ?
        sale: false,

        price: -1,
        markup: 25,
        cost_total: undefined,
        description: undefined,
        descriptionSeo: undefined,
        imageWebp: undefined,
        wwwroot: undefined,
        wwwrootOK: undefined,
      },
      stateView: StateView.create,
    });
  }

}
