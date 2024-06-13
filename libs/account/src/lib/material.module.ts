import { NgModule } from '@angular/core';

import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCheckboxModule} from '@angular/material/checkbox';

import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';



const material = [
  
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatInputModule,
  MatFormFieldModule,
  MatCheckboxModule,
  
  MatDividerModule,
  MatListModule

  
]

@NgModule({
  declarations: [],
  imports: [material],
  exports:[material],
  providers:[
   
  ]
})
export class MaterialModule { }
