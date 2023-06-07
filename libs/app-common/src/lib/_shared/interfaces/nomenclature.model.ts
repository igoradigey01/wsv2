export interface Nomenclature {
  id: number;
  guid: string | undefined;
  name: string;
  description: string | undefined;
 
  cost_total: number; // полная стоимость
  price:number;
  markup:number|undefined; //наценка


  inStock: boolean | undefined; //есть  на складе ?

  katalogId:number;
  katalogName?:string |undefined;

  colorName: string | undefined;
  brandName: string | undefined;
  articleName: string | undefined;
  
  postavchik: string | undefined;


}
