import {OrderDetails} from './order-details.model'

export interface Order {
    id:number    
    orderNumber:number|undefined
    ownerId:string
    ownerPhone:string
    createdAt:Date|undefined // дата создания generate on mysql as default value
    closedAt:Date|undefined  
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
   
    orderItems: OrderDetails[]
   
  }
  