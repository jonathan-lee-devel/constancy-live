import {Injectable} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {ModalService} from '../modal/modal.service';

@Injectable({
  providedIn: 'root',
})
export class CookiesNoticeService {
  private static COOKIE_NOTICE_ACCEPTED_KEY: string = 'Cookies-Notice';
  private static COOKIE_NOTICE_IS_ACCEPTED_TRUE: string = 'Accepted';
  private static COOKIE_NOTICE_EXPIRY_TIME_MONTHS: number = 1;

  constructor(private cookieService: CookieService, private modalService: ModalService) { }

  public triggerIfNotAccepted(): void {
    if (this.cookieService.get(CookiesNoticeService.COOKIE_NOTICE_ACCEPTED_KEY) !==
      CookiesNoticeService.COOKIE_NOTICE_IS_ACCEPTED_TRUE) {
      setTimeout(() => this.modalService.showCookiesNoticeModal(), 500);
    }
  }

  public doAccept(): void {
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + CookiesNoticeService.COOKIE_NOTICE_EXPIRY_TIME_MONTHS);
    this.cookieService.set(
        CookiesNoticeService.COOKIE_NOTICE_ACCEPTED_KEY,
        CookiesNoticeService.COOKIE_NOTICE_IS_ACCEPTED_TRUE,
        {secure: true, expires: expiryDate, sameSite: 'Strict'});
  }
}
