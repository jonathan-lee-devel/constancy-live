import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ModalService} from '../modal/modal.service';
import {PasswordResetDto} from '../../dtos/password/PasswordResetDto';
import {Router} from '@angular/router';
import {RoutePaths} from '../../app-routing.module';

@Injectable({
  providedIn: 'root',
})
export class PasswordService {
  constructor(private httpClient: HttpClient,
              private modalService: ModalService,
              private router: Router) { }

  public sendPasswordResetRequest(email: string): void {
    this.httpClient.post<PasswordResetDto>(`${environment.MAIN_API_URL}/password/reset`, {email})
        .subscribe((passwordResetDto) => {
          let message: string;
          switch (passwordResetDto.status) {
            case 'AWAITING_EMAIL_VERIFICATION':
              message = 'Please check your e-mail inbox for further instructions';
              break;
            default:
              message = 'An unknown error has occurred';
          }
          this.modalService.showDefaultModal('Password Reset Status', message);
        });
  }

  confirmPasswordReset(tokenValue: string, password: string, confirmPassword: string) {
    this.httpClient.post<PasswordResetDto>(`${environment.MAIN_API_URL}/password/reset/confirm`, {
      tokenValue,
      password,
      confirmPassword,
    })
        .subscribe((passwordResetDto) => {
          let message: string;
          let shouldRedirect = false;
          switch (passwordResetDto.status) {
            case 'SUCCESS':
              message = 'Password has been reset successfully, you may now log in';
              shouldRedirect = true;
              break;
            default:
              message = 'An unknown error has occurred';
          }
          if (shouldRedirect) {
            this.router.navigate([`/${RoutePaths.LOGIN}`]).catch((reason) => window.alert(reason));
          }
          this.modalService.showDefaultModal('Password Reset Status', message);
        });
  }
}
