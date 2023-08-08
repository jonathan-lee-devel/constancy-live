import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../../../services/auth/auth.service';

@Component({
  selector: 'app-google-login-success',
  templateUrl: './google-login-success.component.html',
  styleUrls: ['./google-login-success.component.css'],
})
export class GoogleLoginSuccessComponent implements OnInit {
  constructor(private httpClient: HttpClient,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.authService.onSuccessfulGoogleLogin();
  }
}
