export interface Product {
  id: number;
  guid: string | undefined;
  img_guids:string[]|undefined; // from Photos table
  hidden:boolean;
  ownerId:string;
  product_typeId :number;
  title: string;


  subCatalogId:number;
  subCatalogName:string |undefined;

  colorId:number; 
  colorName: string | undefined;

  brandid:number;
  brandName: string | undefined;

  articleId:number;
  articleName: string | undefined;
  
  position:number;
  

  inStock: boolean | undefined; //есть  на складе ?
  sale:boolean |undefined; 
  
  price:number;
  markup:number; //наценка        
  // not in db                         
  cost_total: number | undefined; // полная стоимость for orders 


  description: string | undefined;
  descriptionSeo:string | undefined;
 
  

  

 

  
  



}
