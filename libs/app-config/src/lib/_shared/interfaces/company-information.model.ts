import { ISliderImage} from './slider-image.model'
import {IPhone} from './phone.model'

export interface IGeoPoint{
    x:string;
    y:string;
}

export interface IWorkTime{
    start:string;
    end:string;
}

export interface ICompanyInformation {

    yandex_point:IGeoPoint; // x ,y
    yandex_zoom:number; 
    company_phone: string;
    company_normalize_phone: string;
    company_phones:IPhone[];
    company_photo:ISliderImage[]; //photo_1.webp,photo_2.webp...
    company_name:string;
    company_copyright:string;
    company_time_create:string;
    company_activities:string;
    company_logo:string;// logo.webp
    company_work_time:IWorkTime;
    company_work_timeSaturdaySunday:IWorkTime|undefined; //суббота воскресенье
    company_day_off:string[]; //выходные
    company_delivery:boolean; //доставка
    company_lunch_time:IWorkTime|undefined;
    company_guarantees:string;
    company_email_for_privacy_police:string|undefined;
}