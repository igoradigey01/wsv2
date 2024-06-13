import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService} from '@wsv2/app-config';

@Component({
  selector: 'wsv2-db-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './db-info.component.html',
  styleUrls: ['./db-info.component.scss'],
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
