import { Component ,OnInit, ChangeDetectionStrategy} from '@angular/core';
import { Router ,ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { KatalogComponent } from '@wsv2/ui';
import {SubKatalog,IButton} from '@wsv2/app-common'
import { SubKatalogService } from '../_shared/services/sub-katalog.service'
import { signal } from '@angular/core';

@Component({
  selector: 'wsv2-sub-catalog',
  standalone: true,
  imports: [CommonModule,KatalogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sub-catalog.component.html',
  styleUrls: ['./sub-catalog.component.scss'],
})
export class SubCatalogComponent  implements OnInit{

 

  subkatalogs = signal<SubKatalog[]>([])
   idKatatlog:number|undefined;


  constructor(
    private _repository: SubKatalogService,
    private routeActvate: ActivatedRoute,
    private router: Router,
    ) {
   //   = this.route.snapshot.queryParams['id'];
      routeActvate.params.subscribe(params=>this.idKatatlog=params['id']);
      

     }

  ngOnInit(): void {
    //debugger
    if(!this.idKatatlog) return;
    this._repository.SubKatalogs(this.idKatatlog).subscribe({
      next: (data) => {
        this.subkatalogs.set( data);
        console.log( this.subkatalogs);
      },
      error: (err:HttpErrorResponse) => console.error('load katalog err: --' + err.message)
    });
  }

  ChangeButton(idSubKatalog:IButton){
  //  this.router.navigate(['/heroes', { id: heroId }]);
  this.router.navigate(['/index/katalogs',this.idKatatlog,'products', idSubKatalog.id ]);
    console.log("change sub catalog - " + idSubKatalog.id)

  }
}
