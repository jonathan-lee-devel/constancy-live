import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserDto} from '../../dtos/auth/UserDto';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private httpClient: HttpClient) { }

  getUserInfo(): Observable<UserDto> {
    return this.httpClient.get<UserDto>(`${environment.MAIN_API_URL}/profile`);
  }
}
