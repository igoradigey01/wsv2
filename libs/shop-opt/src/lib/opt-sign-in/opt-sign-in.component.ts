import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';


import { OptManagerService } from '../_shared/services/opt-manager.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'wsv2-opt-sign-in',
    imports: [],
    templateUrl: './opt-sign-in.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./opt-sign-in.component.scss']
})
export class OptSignInComponent implements OnInit {
  constructor(
    private optManager: OptManagerService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.route.queryParams.subscribe((queryParam: any) => {
      const param = queryParam['user'];
      if (param && param === 'opt1') {
        this.optManager.setValidOpt();
      }
    });
    this.redirect();
  }
  private redirect() {
    //  debugger

    this.router.navigate(['/'],{queryParams:{'opt':true}});
  }
}
