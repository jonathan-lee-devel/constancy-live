import {Component} from '@angular/core';
import {OrganizationService} from '../../../../services/organization/organization.service';
import {ModalService} from '../../../../services/modal/modal.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-create-organization',
  templateUrl: './create-organization.component.html',
  styleUrls: ['./create-organization.component.css'],
})
export class CreateOrganizationComponent {
  organizationName: string = '';

  constructor(private organizationService: OrganizationService, private modalService: ModalService, private router: Router) {
  }

  doCreateOrganization() {
    this.organizationService.createOrganization(this.organizationName)
        .subscribe((organization) => {
          this.modalService.showDefaultModal('Organization', `Organization with name "${organization.name}" created`);
          this.router.navigate([`/organizations/dashboard/${organization.id}`]).catch((reason) => window.alert(reason));
        });
  }
}
