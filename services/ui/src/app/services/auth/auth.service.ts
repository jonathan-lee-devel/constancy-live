import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserDto} from '../../dtos/auth/UserDto';
import {environment} from '../../../environments/environment';
import {Router} from '@angular/router';
import {LoginDto} from '../../dtos/auth/LoginDto';
import {LogoutDto} from '../../dtos/auth/LogoutDto';
import {ProfileService} from '../profile/profile.service';
import {RoutePaths} from '../../app-routing.module';

@Injectable({
  providedIn: 'root',
})
/**
 * Auth service used to authenticate users.
 * @author jonathanlee <jonathan.lee.devel@gmail.com>
 */
export class AuthService {
  public static readonly DEFAULT_USER: UserDto = {
    email: 'user@mail.com',
    firstName: 'Anonymous',
    lastName: 'Anonymous',
  };
  private static readonly USER_DATA_KEY: string = 'userInfo';

  @Output() isLoggedIn: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output() userInfo: EventEmitter<UserDto> = new EventEmitter<UserDto>();

  /**
   * Standard constructor
   * @param {HttpClient} httpClient used to access backend API
   * @param {Router} router used to route accordingly
   * @param {ProfileService} profileService used to obtain user data on Google sign-in
   */
  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private profileService: ProfileService,
  ) {
  }

  public getCurrentUserInfo(): UserDto {
    const userData = sessionStorage.getItem(AuthService.USER_DATA_KEY);
    if (userData) {
      return JSON.parse(userData);
    }

    return (userData) ? JSON.parse(userData) : AuthService.DEFAULT_USER;
  }

  /**
   * Used to determine if a user is authenticated.
   * @return {Observable} boolean indicating if user is authenticated
   */
  public isAuthenticated(): boolean {
    const userData = sessionStorage.getItem(AuthService.USER_DATA_KEY);
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      if (parsedUserData) {
        return true;
      }
    }
    return false;
  }

  /**
   * Allow for subscription to isLoggedIn event emitter.
   * @return {Observable<boolean>} observable for isLoggedIn event emitter
   */
  public getIsLoggedIn(): Observable<boolean> {
    return this.isLoggedIn;
  }

  /**
   * Sets user info to a JSON-stringified version of parameter passed.
   * @param {UserDto} userInfo user info to be set
   */
  setUserInfo(userInfo: UserDto): void {
    sessionStorage.setItem(AuthService.USER_DATA_KEY, JSON.stringify(userInfo));
  }

  /**
   * Deletes user info from local storage.
   */
  deleteUserInfo(): void {
    sessionStorage.removeItem(AuthService.USER_DATA_KEY);
  }

  doLogin(username: string, password: string): void {
    const body = new HttpParams()
        .set('username', username)
        .set('password', password);

    this.httpClient.post<LoginDto>(`${environment.MAIN_API_URL}/auth/login`, body, {
      withCredentials: true,
    })
        .subscribe((loginDto) => {
          if (loginDto.loginStatus === 'SUCCESS') {
            this.onSuccessfulLogin(loginDto.user);
          } else {
            window.alert('Login Failed');
          }
        });
  }

  /**
   * Logs out from backend.
   */
  doLogout(): void {
    this.deleteUserInfo();
    this.isLoggedIn.next(false);
    this.userInfo.next(AuthService.DEFAULT_USER);
    this.httpClient.post<LogoutDto>(`${environment.MAIN_API_URL}/auth/logout`, {}, {withCredentials: true}).subscribe(
        (logoutDto) => {
          if (logoutDto.logoutStatus !== 'SUCCESS') {
            window.alert('Logout failed');
          }
          this.router.navigate([`/${RoutePaths.LOGIN}`]).catch((reason) => window.alert(reason));
        },
    );
  }

  doGoogleLogin() {
    window.location.href = `${environment.MAIN_API_URL}/auth/google`;
  }

  onSuccessfulGoogleLogin() {
    this.profileService.getUserInfo().subscribe((userInfo) => {
      this.onSuccessfulLogin(userInfo);
    });
  }

  private onSuccessfulLogin(userInfo: UserDto) {
    this.setUserInfo(userInfo);
    this.isLoggedIn.next(true);
    this.userInfo.next(userInfo);
    this.router.navigate([`/${RoutePaths.DASHBOARD}`]).catch((reason) => window.alert(reason));
  }
}
