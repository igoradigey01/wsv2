import { Component, OnInit, Input } from '@angular/core';
import { CompanyInformationService } from '@wsv2/app-config'
import { ISliderImage, ImageSliderComponent } from '@wsv2/app-common'


interface GeoObjectConstructor {
  feature: ymaps.IGeoObjectFeature;
  options: ymaps.IGeoObjectOptions;
}

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  public condition = true;
  public isActive=true;
  public isDeactive=false;
  public coordinates: number[] = []
  public slideImgs: ISliderImage[] =[];

  public minHeightPhoto ="470"
  public minWidthPhoto="470"
  public marginTopSlideBar:string="85" 
  public marginLeftSlideBar:string="50"
  
  geoObject: GeoObjectConstructor | undefined;

  constructor(
    private repository: CompanyInformationService
  ) {
    // debugger
     this.slideImgs=repository.company_photo;
    let x = repository.yandex_point.x;
    let y = repository.yandex_point.y;
    this.coordinates = [Number(x), Number(y)]
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

  ngOnInit(): void {
  }

  public toggle() {
    this.condition = !this.condition;
    this.isActive=this.condition;
    this.isDeactive=!this.condition

  }
  

}
