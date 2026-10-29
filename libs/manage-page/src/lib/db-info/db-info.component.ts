import { Component, ChangeDetectionStrategy } from '@angular/core';

import { ApiService} from '@wsv2/app-config';

@Component({
    selector: 'wsv2-db-info',
    imports: [],
    templateUrl: './db-info.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./db-info.component.scss']
})
export class DbInfoComponent {


    img_bg=''

    constructor(
      private url:ApiService
    ){
          this.img_bg=url.ServerUri+'images/'+"db_shema.webp"
    }

  public get  slideStyleObj(){
    return `background-image: url(${this.img_bg});`
    //  ` height: ${this.height} ;`

  }
}
