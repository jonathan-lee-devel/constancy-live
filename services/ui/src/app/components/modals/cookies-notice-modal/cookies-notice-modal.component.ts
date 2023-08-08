import {Component, OnInit} from '@angular/core';
import {initModals} from 'flowbite';
import {CookiesNoticeService} from '../../../services/cookies-notice/cookies-notice.service';

@Component({
  selector: 'app-cookies-notice-modal',
  templateUrl: './cookies-notice-modal.component.html',
  styleUrls: ['./cookies-notice-modal.component.css'],
})
/**
 * Cookies notice modal component.
 */
export class CookiesNoticeModalComponent implements OnInit {
  /**
   * Standard constructor.
   * @param {CookiesNoticeService} cookiesNoticeService used to access cookies notice
   */
  constructor(private cookiesNoticeService: CookiesNoticeService) {
  }


  /**
   * Init method which initializes tailwind modals.
   */
  ngOnInit() {
    initModals();
  }

  /**
   * Action when user accepts cookies notice.
   */
  doAccept() {
    this.cookiesNoticeService.doAccept();
  }
}
