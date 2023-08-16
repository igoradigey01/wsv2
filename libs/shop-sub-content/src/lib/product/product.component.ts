import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ProductService } from '../_shared/services/product.service';
import {Product,StateView} from '@wsv2/app-common'
import { signal } from '@angular/core';

@Component({
  selector: 'wsv2-product',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {

  products = signal<Product[]>([])
  idKatatlog:number|undefined;
  subkatalog_name ='';
  pageTitle =this.subkatalog_name;
   flagViewState: StateView = StateView.default;

  constructor(
    private _repository: ProductService,
    private routeActvate: ActivatedRoute
  ) {
    //   = this.route.snapshot.queryParams['id'];
    routeActvate.params.subscribe((params) => (this.idKatatlog = params['id']));
  }

  ngOnInit(): void {
    //debugger
    if(!this.idKatatlog) return;
    // this._repository.Products(this.idKatatlog).subscribe({
    //   next: (data) => {
    //     this. products.set( data);
    //     console.log( this.products);
    //   },
    //   error: (err:HttpErrorResponse) => console.error('load katalog err: --' + err.message)
    // });
  }


  
  public onBackInNavBar() {
    // //console.log(" onBackInNavBar")
    //  if(this.sharedVar.IdCategoria!==-1)
    // this.router.navigateByUrl('/content/categoria/'+this.sharedVar.IdCategoria);
    // else{
    //   if(this._nomenclatures.length>0)
    //   this.repository.KatalogN(this._nomenclatures[0].katalogId).subscribe(
    //     d=>{

    //       this.router.navigateByUrl('/content/categoria/'+d.categoriaId);

    //     }
    //   )



    


  }

}
