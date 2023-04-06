import { Component, OnInit } from '@angular/core';


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

  geoObject: GeoObjectConstructor = {
    feature: {
      // The geometry description.
      geometry: {
        type: 'Point',
        coordinates: [44.687199, 39.977717],
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
  };

  constructor() { }

  ngOnInit(): void {
  }

}
