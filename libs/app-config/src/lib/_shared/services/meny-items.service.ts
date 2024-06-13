import { Injectable } from '@angular/core';
import  {IMenyItem} from '../interfaces/meny-item.model'

@Injectable({
    providedIn: 'root',
  })
  export class MenyItemsService {

  public shopMenyItems:IMenyItem[]=[]
  public managerMenyItems:IMenyItem[]=[] 
  public adminMenyItems:IMenyItem[]=[]
    
  }