import {OrderItem} from './order-item.model'

export interface Order {
    id:number
    guid:number |undefined
    orderNumber:number|undefined
    date:string // дата   
    adress:string 
    isСompleted:boolean  // true - накладная выписана ,заказ скомплектован
    
    phone:string|undefined
    mail:string|undefined
    orderItems: OrderItem[]
    total:number //Итого
  }
  