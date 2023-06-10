import { Component } from '@angular/core';
import { CompanyInformationService } from '@wsv2/app-config'
import { ISliderImage} from '@wsv2/app-common'
//import {ImageSliderComponent} from '@wsv2/ui'



interface GeoObjectConstructor {
  feature: ymaps.IGeoObjectFeature;
  options: ymaps.IGeoObjectOptions;
}

@Component({
  selector: 'wsv2-app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent  {

  public condition = true;
  public isActive=true;
  public isDeactive=false;
  public coordinates: number[] |undefined;// = []
  public slideImgs: ISliderImage[] =[];

  public minHeightPhoto ="500"
  public minWidthPhoto="200"
  public marginTopSlideBar="85" 
  public marginLeftSlideBar="50"

  
  geoObject: GeoObjectConstructor | undefined;
  yandex_zoom:number;


  constructor(
    private repository: CompanyInformationService
  ) {
    // debugger
     this.slideImgs=repository.company_photo;
    const x = repository.yandex_point.x;
    const y = repository.yandex_point.y;
    this.coordinates = [Number(x), Number(y)]
    this.yandex_zoom=repository.yandex_zoom;
    this.geoObject = {
      feature: {
        // The geometry description.
        geometry: {
          type: 'Point',
          coordinates: this.coordinates,
        },
        // Properties.
        properties: {
          // The placemark content.
          iconContent: "Мы Здесь!!",
          // hintContent: 'Come on, drag already!',
        },
      },
      options: {
        /**
         * Options.
         * The placemark's icon will stretch to fit its contents.
         */
        preset: 'islands#redStretchyIcon',
        // The placemark can be dragged.
        draggable: true,
      },
    }

    //

  }


  public toggle() {
    this.condition = !this.condition;
    this.isActive=this.condition;
    this.isDeactive=!this.condition

  }
  

}
