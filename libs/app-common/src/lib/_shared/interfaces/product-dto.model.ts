export interface Product {
    id: number;
    guid: string | undefined;
    
    hidden:boolean;
    ownerId:string;
    product_typeId :number;
    title: string;
    
    subCatalogId:number;
     
    colorId:number; 
    brandid:number;
    articleId:number;
    
    
    position:number;
    
  
    inStock: boolean | undefined; //есть  на складе ?
    sale:boolean |undefined; 
    
    price:number;
    markup:number; //наценка        
    
  
    description: string | undefined;
    descriptionSeo:string | undefined;
  
  }
  