import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NavbarComponent} from './components/navbar/navbar.component';
import {LandingPageComponent} from './components/pages/landing-page/landing-page.component';
import {CookieService} from 'ngx-cookie-service';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {ErrorInterceptor} from './interceptors/error.interceptor';
import {FormsModule} from '@angular/forms';
import {DashboardComponent} from './components/pages/dashboard/dashboard.component';
import {
  CreateOrganizationComponent,
} from './components/pages/organizations/create-organization/create-organization.component';
import {
  ManageOrganizationsComponent,
} from './components/pages/organizations/manage-organizations/manage-organizations.component';
import {LoginComponent} from './components/pages/login/login.component';
import {NgOptimizedImage} from '@angular/common';
import {ResetPasswordComponent} from './components/pages/reset-password/reset-password.component';
import {RegisterComponent} from './components/pages/register/register.component';
import {CookiesNoticeModalComponent} from './components/modals/cookies-notice-modal/cookies-notice-modal.component';
import {LoadingSpinnerComponent} from './components/loading-spinner/loading-spinner.component';
import {DefaultModalComponent} from './components/modals/default-modal/default-modal.component';
import {RegisterConfirmComponent} from './components/pages/register-confirm/register-confirm.component';
import {
  ResetPasswordConfirmComponent,
} from './components/pages/reset-password-confirm/reset-password-confirm.component';
import {
  OrganizationDashboardComponent,
} from './components/pages/organizations/per-organization/organization-dashboard/organization-dashboard.component';
import {GoogleLoginSuccessComponent} from './components/pages/google-login-success/google-login-success.component';
import {ServerErrorComponent} from './components/pages/error/server-error/server-error.component';
import {PopupModalComponent} from './components/modals/popup-modal/popup-modal.component';
import { ManageAccountComponent } from './components/pages/manage-account/manage-account.component';
import { ErrorNotFoundComponent } from './components/pages/error/error-not-found/error-not-found.component';
import { OrganizationPageComponent } from './components/pages/organizations/per-organization/organization-page/organization-page.component';
import { CreateProductComponent } from './components/pages/organizations/per-organization/create-product/create-product.component';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    LandingPageComponent,
    NavbarComponent,
    DashboardComponent,
    CreateOrganizationComponent,
    ManageOrganizationsComponent,
    LoginComponent,
    ResetPasswordComponent,
    RegisterComponent,
    CookiesNoticeModalComponent,
    DefaultModalComponent,
    LoadingSpinnerComponent,
    RegisterConfirmComponent,
    ResetPasswordConfirmComponent,
    OrganizationDashboardComponent,
    GoogleLoginSuccessComponent,
    ServerErrorComponent,
    PopupModalComponent,
    ManageAccountComponent,
    ErrorNotFoundComponent,
    OrganizationPageComponent,
    CreateProductComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgOptimizedImage,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
    CookieService,
  ],
})
/**
 * Default generated app module.
 */
export class AppModule { }
