import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PasswordService} from '../../../services/password/password.service';

@Component({
  selector: 'app-reset-password-confirm',
  templateUrl: './reset-password-confirm.component.html',
  styleUrls: ['./reset-password-confirm.component.css'],
})
export class ResetPasswordConfirmComponent implements OnInit {
  tokenValue: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(private route: ActivatedRoute,
              private passwordService: PasswordService) {
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.tokenValue = params['tokenValue'];
    });
  }

  doConfirmPasswordReset() {
    this.passwordService.confirmPasswordReset(this.tokenValue, this.password, this.confirmPassword);
  }
}
