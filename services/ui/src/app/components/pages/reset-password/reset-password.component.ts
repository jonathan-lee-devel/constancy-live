import {Component} from '@angular/core';
import {PasswordService} from '../../../services/password/password.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent {
  email: string = '';

  constructor(private passwordService: PasswordService) {
  }

  doSendPasswordResetRequest() {
    this.passwordService.sendPasswordResetRequest(this.email);
  }
}
