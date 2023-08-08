import {EventEmitter, Injectable, Output} from '@angular/core';
import {Modal, ModalInterface, ModalOptions} from 'flowbite';
import {Observable} from 'rxjs';
import {ModalAttributesDto} from '../../dtos/modals/ModalAttributesDto';
import {PopupModalAttributesDto} from '../../dtos/modals/PopupModalAttributesDto';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  @Output() modalAttributes: EventEmitter<ModalAttributesDto> = new EventEmitter<ModalAttributesDto>();
  @Output() popupModalAttributes: EventEmitter<PopupModalAttributesDto> = new EventEmitter<PopupModalAttributesDto>();

  @Output() popupModalConfirmCallback: EventEmitter<Function> = new EventEmitter<Function>();
  @Output() popupModalCancelCallback: EventEmitter<Function> = new EventEmitter<Function>();

  private $popupModal: HTMLElement | undefined;
  private popupModal: ModalInterface | undefined;
  private readonly popupModalOptions: ModalOptions = {placement: 'top-center', backdrop: 'dynamic', closable: true};

  private $cookiesNoticeModal: HTMLElement | undefined;
  private cookiesNoticeModal: ModalInterface | undefined;
  private readonly cookiesNoticeModalOptions: ModalOptions = {placement: 'top-center', backdrop: 'dynamic', closable: false};

  private $defaultModal: HTMLElement | undefined;
  private defaultModal: ModalInterface | undefined;
  private readonly defaultModalOptions: ModalOptions = {placement: 'top-center', backdrop: 'dynamic', closable: true};

  public showPopupModal(
      modalPrompt: string,
      modalConfirmButtonText: string,
      modalCancelButtonText: string,
      confirmCallback: Function,
      cancelCallback: Function) {
    if (!this.popupModal) {
      this.initPopupModal();
    }
    this.popupModalAttributes.next({
      modalPrompt,
      modalConfirmButtonText,
      modalCancelButtonText,
    });
    this.popupModalConfirmCallback.next(confirmCallback);
    this.popupModalCancelCallback.next(cancelCallback);
    this.popupModal?.show();
  }

  public showCookiesNoticeModal() {
    if (!this.cookiesNoticeModal) {
      this.initCookiesNoticeModal();
    }
    this.cookiesNoticeModal?.show();
  }

  public showDefaultModal(modalHeading: string, modalText: string) {
    if (!this.defaultModal) {
      this.initDefaultModal();
    }
    this.modalAttributes.next({
      heading: modalHeading,
      text: modalText,
    });
    this.defaultModal?.show();
  }

  getPopupModalConfirmCallback(): Observable<Function> {
    return this.popupModalConfirmCallback;
  }

  getPopupModalCancelCallback(): Observable<Function> {
    return this.popupModalCancelCallback;
  }

  getPopupModalAttributes(): Observable<PopupModalAttributesDto> {
    return this.popupModalAttributes;
  }

  getModalAttributes(): Observable<ModalAttributesDto> {
    return this.modalAttributes;
  }

  hidePopupModal() {
    this.popupModal?.hide();
  }

  private initPopupModal(): void {
    const popupModalElement = document.getElementById('popupModal');
    if (popupModalElement === null) {
      this.promptRefreshOnError();
      return;
    }
    this.$popupModal = popupModalElement;
    this.popupModal = new Modal(this.$popupModal, this.popupModalOptions);
  }

  private initCookiesNoticeModal(): void {
    const cookiesNoticeModalElement = document.getElementById('cookiesNoticeModal');
    if (cookiesNoticeModalElement === null) {
      this.promptRefreshOnError();
      return;
    }
    this.$cookiesNoticeModal = cookiesNoticeModalElement;
    this.cookiesNoticeModal = new Modal(this.$cookiesNoticeModal, this.cookiesNoticeModalOptions);
  }

  private initDefaultModal(): void {
    const defaultModalElement = document.getElementById('defaultModal');
    if (defaultModalElement === null) {
      this.promptRefreshOnError();
      return;
    }
    this.$defaultModal = defaultModalElement;
    this.defaultModal = new Modal(this.$defaultModal, this.defaultModalOptions);
  }

  private promptRefreshOnError(): void {
    window.alert('An error has occurred, please try refreshing the page');
  }
}
