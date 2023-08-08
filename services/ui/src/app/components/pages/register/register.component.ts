import {Component, OnInit} from '@angular/core';
import {RegisterService} from '../../../services/register/register.service';
import {AuthService} from '../../../services/auth/auth.service';
import {CookiesNoticeService} from '../../../services/cookies-notice/cookies-notice.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  email: string = '';
  firstName: string = '';
  lastName: string = '';
  password: string = '';
  confirmPassword: string = '';
  acceptTermsAndConditions: boolean = false;

  constructor(
        private cookiesNoticeService: CookiesNoticeService,
        private registerService: RegisterService,
        private authService: AuthService,
  ) {
  }

  ngOnInit() {
    this.cookiesNoticeService.triggerIfNotAccepted();
  }

  doRegister() {
    this.registerService.doRegister(
        this.email,
        this.firstName,
        this.lastName,
        this.password,
        this.confirmPassword,
        this.acceptTermsAndConditions,
    );
  }

  doGoogleLogin() {
    this.authService.doGoogleLogin();
  }
}
