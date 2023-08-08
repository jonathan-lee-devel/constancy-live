import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ProductDto} from '../../dtos/products/ProductDto';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private httpClient: HttpClient) { }

  public getProducts(organizationId: string): Observable<ProductDto[]> {
    return this.httpClient.get<ProductDto[]>(`${environment.MAIN_API_URL}/products/${organizationId}`);
  }

  public createProduct(name: string, organizationId: string): Observable<ProductDto> {
    return this.httpClient.post<ProductDto>(`${environment.MAIN_API_URL}/products`, {
      name,
      organizationId,
    });
  }
}
