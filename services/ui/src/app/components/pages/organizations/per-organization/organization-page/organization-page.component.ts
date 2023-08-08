import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {OrganizationService} from '../../../../../services/organization/organization.service';
import {LoadingService} from '../../../../../services/loading/loading.service';
import {OrganizationSnippetDto} from '../../../../../dtos/organization/OrganizationSnippetDto';
import {ProductDto} from '../../../../../dtos/products/ProductDto';
import {ProductService} from '../../../../../services/product/product.service';

@Component({
  selector: 'app-organization-page',
  templateUrl: './organization-page.component.html',
  styleUrls: ['./organization-page.component.css'],
})
export class OrganizationPageComponent implements OnInit {
  organization: OrganizationSnippetDto = {
    id: 'Loading...',
    name: 'Loading...',
  };
  isLoading = true;
  products: ProductDto[] = [];

  constructor(private activatedRoute: ActivatedRoute,
              private organizationService: OrganizationService,
              private productService: ProductService,
              private loadingService: LoadingService) {
    this.loadingService.isLoadingObservable()
        .subscribe((isLoading) => {
          this.isLoading = isLoading;
        });
  }
  ngOnInit() {
    this.loadingService.onLoadingStart();
    this.activatedRoute.params.subscribe((params) => {
      this.organizationService.getOrganizationSnippetById(params['organizationId'])
          .subscribe((organization) => {
            this.organization = organization;
            this.productService.getProducts(params['organizationId'])
                .subscribe((products) => {
                  setTimeout(() => {
                    this.products = products;
                    this.loadingService.onLoadingFinished();
                  }, 1000);
                });
          });
    });
  }
}
