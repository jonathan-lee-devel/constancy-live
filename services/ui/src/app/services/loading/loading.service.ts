import {EventEmitter, Injectable, Output} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  @Output() isLoading = new EventEmitter<boolean>();

  constructor() { }

  public isLoadingObservable(): Observable<boolean> {
    return this.isLoading;
  }

  public onLoadingStart() {
    this.isLoading.next(true);
  }

  public onLoadingFinished() {
    this.isLoading.next(false);
  }
}
