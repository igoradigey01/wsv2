import { NgModule } from '@angular/core';
 import { MatButtonModule } from '@angular/material/button';
// import {MatToolbarModule} from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
// import {MatListModule} from '@angular/material/list';
import {MatDividerModule} from '@angular/material/divider';



const material = [
   MatButtonModule,
  // MatToolbarModule,
   MatIconModule,
  // MatListModule
  //MatDividerModule
]

@NgModule({
  declarations: [],
  imports: [material],
  exports: [material]
})
export class MaterialModule { }
