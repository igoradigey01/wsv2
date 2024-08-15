//import { SafeUrl } from "@angular/platform-browser";

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

  brandId:number;
  brandName: string | undefined;

  articleId:number;
  articleName: string | undefined;
  
  position:number;
  

  inStock: boolean ; //есть  на складе ?
  sale:boolean; 
  
  price:number;
  markup:number; //наценка        
  // not in db                         
  cost_total: number | undefined; // полная стоимость for orders 

  description: string | undefined;
  descriptionSeo:string | undefined;

  imageWebp:  Blob| string| undefined; // именованая ссылка на Blob  window.URL.createObjectURL(d)
//  wwwrootOK:boolean| undefined;                    // onChangeWebp?:boolean; // change  img on server (wwwroot/image)
  wwwroot: string | undefined;  //url for  server-folder wwwroot/

}
