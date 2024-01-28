import { Component, computed ,signal} from '@angular/core';
import { CommonModule } from '@angular/common';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { StateView } from '@wsv2/app-common';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { Color } from '@wsv2/app-common';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ColorService} from '../_shared/services/color.service';
import { ProductTypeService } from '../_shared/services/product_type.service';
import {ColorListComponent } from './color-list.component';
import { ColorItemComponent } from './color-item.component';
import { MatSelectModule } from '@angular/material/select';

import { ActivatedRoute } from '@angular/router';


export interface EmitData {
  color: Color;
  stateView: StateView;
}

@Component({
  selector: 'wsv2-color-shell',
  standalone: true,
  imports: [
    CommonModule,
    MatSelectModule,
    ColorListComponent,
    ColorItemComponent
  ],
  templateUrl: './color-shell.component.html',
  styleUrls: ['./color-shell.component.scss'],
})
export class ColorShellComponent {

  public selected_product_typeId =1;
  private state_selected=signal(this.selected_product_typeId);
  public product_type_of_clientId=1;

  public flag = StateView.default;
  
   
  //public selected_product_type =computed(()=>this.selected_product_typeId)

  public colors = computed(() => this.repository
  .Colors()
  .filter((f) => f.product_typeId === this.state_selected())
  
  );

  public product_typeIds = this.repositoryProductType.ProductTypes;

  public message = this.repository.Message;

  public item = <Color>{
    id: 0,
    name: '',
    ownerId: 'none',
    product_typeId: 2,
    hidden: false,
  };

  constructor(
    private route: ActivatedRoute,
    private repository: ColorService,
    private repositoryProductType: ProductTypeService
  ) {
    this.route.data.subscribe((v) => {
      const id=+v['type_product']
      this.product_type_of_clientId=id;
      this.selected_product_typeId=id;
      this.state_selected.update(()=>id) ;
    }); 
          console.log ( 'repository.Colors'+JSON.stringify( this.repository.Colors()))
    //console.log (repositoryProductType.ProductTypes())
    repository.ClearMessage();
   
  }

  //----------------------

  public onColorChange(event: EmitData) {
    this.item = event.color;
    this.flag = event.stateView;
  }

  public colorModified(event: EmitData) {
    // debugger
    if (event.stateView === StateView.create) {
      this.repository.Create(event.color);
      this.flag = StateView.default;
    }
    if (event.stateView === StateView.edit) {
      this.repository.Update(event.color);
      this.flag = StateView.default;
    }
    if (event.stateView === StateView.exit) {
      this.flag = StateView.default;
    }
    if (event.stateView === StateView.delete) {
      this.repository.Delete(event.color);
      this.flag = StateView.default;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public doSomething(evnt:any){
  

  // console.log( evnt.value);
   this.state_selected.update(()=> evnt.value) 
  //   console.log("this.Colors--"+JSON.stringify(this.Colors()))

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
