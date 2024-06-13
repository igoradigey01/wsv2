import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from '../_shared/services/account.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-email-confirmation',
  templateUrl: './email-confirmation.component.html',
  styleUrls: ['./email-confirmation.component.scss'],
})
export class EmailConfirmationComponent implements OnInit {
  public showSuccess: boolean = false;
  public _errorMgs: string[] = [];

  constructor(
    private repozitory: AccountService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.confirmEmail();
  }

  private confirmEmail = () => {
    const token = this.route.snapshot.queryParams['token'];
    const email = this.route.snapshot.queryParams['email'];
    console.log(token);
    this.repozitory.confirmEmail(token, email).subscribe({
      next: (_) => {
        this.showSuccess = true;
      },

      error: (err:HttpErrorResponse) => {
        console.error(err)
        this._errorMgs.push(err.error);
      },
    });
  };
}
