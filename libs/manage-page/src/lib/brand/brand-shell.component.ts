import { Component, computed ,signal} from '@angular/core';
import { CommonModule } from '@angular/common';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ProductType, StateView } from '@wsv2/app-common';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { Brand } from '@wsv2/app-common';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { BrandService} from '@wsv2/shop-content';
import { ProductTypeService } from '@wsv2/shop-content';
import {BrandListComponent } from './brand-list.component';
import { BrandItemComponent } from './brand-item.component';
import { MatSelectModule } from '@angular/material/select';

import { ActivatedRoute } from '@angular/router';


export interface EmitData {
  brand: Brand;
  stateView: StateView;
}
@Component({
  selector: 'wsv2-brand-shell',
  standalone: true,
  imports: [
    CommonModule,
    MatSelectModule,
    BrandListComponent,
    BrandItemComponent
  ],
  templateUrl: './brand-shell.component.html',
  styleUrls: ['./brand-shell.component.scss'],
})
export class BrandShellComponent {
  
  public state_product_type_id=signal(0);

  public flag = StateView.default;
  
   
  //public selected_product_type =computed(()=>this.selected_product_typeId)

  public brands = computed(() => 
  // console.log ( 'repository.Brands'+JSON.stringify( this.repository.Brands()))

  this.repository
      .Brands()
      .filter((f) => f.product_typeId ===  this.state_product_type_id())
 
  );

  public product_typeIds = this.repositoryProductType.ProductTypes;

  public message = this.repository.Message;

  public item = <Brand>{
    id: 0,
    name: '',
    ownerId: 'none',
    product_typeId: 2,
    hidden: false,
  };

  constructor(
    private route: ActivatedRoute,
    private repository: BrandService,
    private repositoryProductType: ProductTypeService
  ) {
    this.route.data.subscribe((v) => {
      const id=+v['type_product']
      this.state_product_type_id.set(id);
     
    }); 
        
    //console.log (repositoryProductType.ProductTypes())
    repository.ClearMessage();
   
  }

  //----------------------

  public onBrandChange(event: EmitData) {
    this.item = event.brand;
    this.flag = event.stateView;
  }

  public brandModified(event: EmitData) {
    // debugger
    if (event.stateView === StateView.create) {
      this.repository.Create(event.brand);
      this.flag = StateView.default;
    }
    if (event.stateView === StateView.edit) {
      this.repository.Update(event.brand);
      this.flag = StateView.default;
    }
    if (event.stateView === StateView.exit) {
      this.flag = StateView.default;
    }
    if (event.stateView === StateView.delete) {
      this.repository.Delete(event.brand);
      this.flag = StateView.default;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public doSomething(evnt:any){
  

  // console.log( evnt.value);
   //this.state_selected.update(()=> evnt.value) 
  //   console.log("this.Brands--"+JSON.stringify(this.brands()))

  }

  //--------------------

  public onChangedDefaultState() {
    //debugger
    this.flag = StateView.default;
  }

  cancel() {
    this.flag = StateView.default;
    //this._flagDisplayAddButton = true;
  }

}
