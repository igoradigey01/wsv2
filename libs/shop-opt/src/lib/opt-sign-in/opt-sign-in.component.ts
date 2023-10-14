import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OptManagerService } from '../_shared/services/opt-manager.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'wsv2-opt-sign-in',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './opt-sign-in.component.html',
  styleUrls: ['./opt-sign-in.component.scss'],
})
export class OptSignInComponent implements OnInit {
  constructor(
    private optManager: OptManagerService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
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

    this.router.navigate(['/']);
  }
}
