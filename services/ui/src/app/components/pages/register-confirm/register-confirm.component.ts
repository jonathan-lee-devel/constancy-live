import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {RegisterService} from '../../../services/register/register.service';

@Component({
  selector: 'app-register-confirm',
  templateUrl: './register-confirm.component.html',
  styleUrls: ['./register-confirm.component.css'],
})
export class RegisterConfirmComponent implements OnInit {
  tokenValue: string = '';

  constructor(private route: ActivatedRoute,
              private registerService: RegisterService) {
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.tokenValue = params['tokenValue'];
    });
  }

  doConfirmRegister() {
    this.registerService.doConfirmRegister(this.tokenValue);
  }
}
