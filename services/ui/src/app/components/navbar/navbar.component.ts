import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
/**
 * Navbar component.
 */
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;
  protected readonly environment = environment;

  /**
   * Standard constructor.
   * @param {AuthService} authService used for authentication
   */
  constructor(private authService: AuthService) {
  }

  /**
   * Standard ngOnInit method subscribes to the authentication login data.
   */
  ngOnInit() {
    this.authService.isLoggedIn.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });
    this.isLoggedIn = this.authService.isAuthenticated();
  }

  /**
   * Log out action.
   */
  doLogout() {
    this.authService.doLogout();
  }
}
