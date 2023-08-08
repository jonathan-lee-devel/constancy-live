import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleLoginSuccessComponent } from './google-login-success.component';

describe('GoogleLoginSuccessComponent', () => {
  let component: GoogleLoginSuccessComponent;
  let fixture: ComponentFixture<GoogleLoginSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoogleLoginSuccessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoogleLoginSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
