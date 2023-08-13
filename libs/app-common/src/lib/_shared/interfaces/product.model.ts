export interface Product {
  id: number;
  guid: string | undefined;
  img_guids:string[]|undefined;
  name: string;
  description: string | undefined;
 
  cost_total: number | undefined; // полная стоимость
  price:number;
  markup:number|undefined; //наценка


  inStock: boolean | undefined; //есть  на складе ?
  sale:boolean |undefined;

  katalogId:number;
  katalogName:string |undefined;

  colorId:number; 
  colorName: string | undefined;

  brandid:number;
  brandName: string | undefined;

  articleId:number;
  articleName: string | undefined;

  hidden:boolean;
  
  postavchik: string | undefined;


}
