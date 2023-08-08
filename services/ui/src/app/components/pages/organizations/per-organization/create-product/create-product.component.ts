import {Component, OnInit} from '@angular/core';
import {ProductService} from '../../../../../services/product/product.service';
import {ModalService} from '../../../../../services/modal/modal.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css'],
})
export class CreateProductComponent implements OnInit {
  organizationId = '';
  productName = '';

  constructor(
      private route: ActivatedRoute,
      private productService: ProductService,
      private modalService: ModalService,
      private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.organizationId = params['organizationId'];
    });
  }

  doCreateProduct(): void {
    this.productService.createProduct(this.productName, this.organizationId)
        .subscribe((product) => {
          this.modalService.showDefaultModal('Product Created', `Product created with ID: ${product.id}`);
          this.router.navigate([`organizations/dashboard/${this.organizationId}`]).catch((reason) => window.alert(reason));
        });
  }
}
