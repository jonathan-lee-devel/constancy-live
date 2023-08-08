import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../services/auth/auth.service';
import {CookiesNoticeService} from '../../../services/cookies-notice/cookies-notice.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';

  constructor(
    private cookiesNoticeService: CookiesNoticeService,
    private authService: AuthService) {
  }

  ngOnInit() {
    this.cookiesNoticeService.triggerIfNotAccepted();
  }

  doLogin() {
    this.authService.doLogin(this.username, this.password);
  }

  doGoogleLogin() {
    this.authService.doGoogleLogin();
  }
}
