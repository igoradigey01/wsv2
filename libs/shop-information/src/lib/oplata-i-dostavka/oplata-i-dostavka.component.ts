import { Component, OnInit } from '@angular/core';
import {CompanyInformationService} from '@wsv2/app-config';
import {IWorkTime} from '@wsv2/app-config'

@Component({
  selector: 'app-oplata-i-dostavka',
  templateUrl: './oplata-i-dostavka.component.html',
  styleUrls: ['./oplata-i-dostavka.component.scss']
})
export class OplataIDostavkaComponent implements OnInit {

  public product_delivery:boolean=false;
  public work_time:IWorkTime;
  public work_time_timeSaturdaySunday:IWorkTime|undefined;
  public company_day_off:string|undefined;

  constructor(
    private repository:CompanyInformationService
  ) { 
    this.product_delivery=repository.company_delivery;
    this.work_time=repository.company_work_time;
    this.work_time_timeSaturdaySunday=repository.company_work_timeSaturdaySunday;
    debugger
    if(repository.company_day_off.length>0){
      this.company_day_off=repository.company_day_off[0];
      if(repository.company_day_off.length>1){

        this.company_day_off+=","+repository.company_day_off[1];

      }
      }; 
      
    //this.company_day_off=repository.company_day_off;
  }

  ngOnInit(): void {
  }

}
