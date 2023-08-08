import {Component, OnInit} from '@angular/core';
import {ModalService} from '../../../services/modal/modal.service';
import {initModals} from 'flowbite';

@Component({
  selector: 'app-popup-modal',
  templateUrl: './popup-modal.component.html',
  styleUrls: ['./popup-modal.component.css'],
})
/**
 * Pop-up modal component.
 */
export class PopupModalComponent implements OnInit {
  modalPrompt: string = 'Prompt';
  modalConfirmButtonText: string = 'Confirm';
  modalCancelButtonText: string = 'Cancel';

  /**
   * Standard constructor.
   * @param {ModalService} modalService used to initialize pop-up modal.
   */
  constructor(private modalService: ModalService) {
    this.modalService.getPopupModalAttributes().subscribe((popupModalAttributes) => {
      this.modalPrompt = popupModalAttributes.modalPrompt;
      this.modalConfirmButtonText = popupModalAttributes.modalConfirmButtonText;
      this.modalCancelButtonText = popupModalAttributes.modalCancelButtonText;
    });
    this.modalService.getPopupModalConfirmCallback().subscribe((confirmCallback) => {
      this.currentConfirmCallback = confirmCallback;
    });
    this.modalService.getPopupModalCancelCallback().subscribe((cancelCallback) => {
      this.currentCancelCallback = cancelCallback;
    });
  }

  currentConfirmCallback: Function = () => {
    return;
  };

  currentCancelCallback: Function = () => {
    return;
  };

  /**
   * Init method which initializes tailwind modals.
   */
  ngOnInit() {
    initModals();
  }

  /**
   * Action to close the prompt.
   */
  closePrompt() {
    this.modalService.hidePopupModal();
  }

  /**
   * Action to confirm the prompt.
   */
  onConfirm() {
    this.modalService.hidePopupModal();
    this.currentConfirmCallback();
  }

  /**
   * Action to cancel the prompt.
   */
  onCancel() {
    this.modalService.hidePopupModal();
    this.currentCancelCallback();
  }
}
