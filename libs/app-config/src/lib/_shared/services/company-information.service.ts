import { Injectable } from '@angular/core';
import {ICompanyInformation,IGeoPoint,IWorkTime} from '../interfaces/company-information.model'
import { ISliderImage} from '../interfaces/slider-image.model'
import {IPhone} from '../interfaces/phone.model'



@Injectable({
  providedIn: 'root',
})
export class CompanyInformationService implements ICompanyInformation {
    yandex_point:IGeoPoint={x:'',y:''}// x ,y 
    yandex_zoom=12;
    company_phone='';
    company_normalize_phone ='';
    company_phones:IPhone[]=[];
    company_photo:ISliderImage[]=[]; //photo_1.webp,photo_2.webp...
    company_name='';
    company_copyright='ИП';
    company_time_create="2023";
    company_activities="Розничная торговля мебелью.  Ханская"; //виды деятельности компании
    company_logo ='logo.webp';// logo.webp
    company_work_time:IWorkTime={start:'9-00',end:'17-00'};
   
    company_work_timeSaturdaySunday:IWorkTime|undefined; // время работы в субботу воскресенье
    company_day_off:string[]=["воскресенье"]; //выходные
    company_delivery=true;  // доставка
    company_lunch_time:IWorkTime|undefined; // время обеда
    company_guarantees='без предоставления каких-либо гарантий';
    company_email_for_privacy_police:string|undefined;
}