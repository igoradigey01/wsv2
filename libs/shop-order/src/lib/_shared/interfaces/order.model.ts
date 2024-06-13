import {OrderDetail} from './order-detail.model'

export interface Order {
    id:number    
    orderNO:string|undefined
    ownerId:string
    ownerPhone:string
    createdAt:Date // дата создания generate on api
    closedAt:Date  //0001-01-01T00:00:00 minValue
    orderAdress:string |undefined
    orderPickup:boolean //самовывоз ?
    orderNote:string|undefined

    customerFullName:string
    customerId :string|undefined // id for IdentityUser
    customerPhone:string|undefined
    customerMail:string|undefined

    payment_total:number // получено денег за заказ
    total:number  // Общая стоимость заказа // Итого:
  
    paymentStateId:number

    orderStateId:number
   
    orderItems: OrderDetail[]
   
  }
  