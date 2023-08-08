import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {OrganizationService} from '../../../../../services/organization/organization.service';
import {OrganizationDto} from '../../../../../dtos/organization/OrganizationDto';
import {LoadingService} from '../../../../../services/loading/loading.service';

@Component({
  selector: 'app-organization-dashboard',
  templateUrl: './organization-dashboard.component.html',
  styleUrls: ['./organization-dashboard.component.css'],
})
export class OrganizationDashboardComponent implements OnInit {
  organization: OrganizationDto = {
    id: 'Loading...',
    name: 'Loading...',
    administratorEmails: [],
    memberEmails: [],
  };
  isLoading = true;

  constructor(private activatedRoute: ActivatedRoute, private organizationService: OrganizationService, private loadingService: LoadingService) {
    this.loadingService.isLoadingObservable()
        .subscribe((isLoading) => {
          this.isLoading = isLoading;
        });
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.organizationService.getOrganizationById(params['organizationId'])
          .subscribe((organization) => {
            this.organization = organization;
            this.loadingService.onLoadingFinished();
          });
    });
  }

  doAddAdministratorToMembers(administratorEmail: string) {
    this.loadingService.onLoadingStart();
    this.organizationService.addAdministratorAsMember(this.organization.id, administratorEmail)
        .subscribe((organizationMembershipStatus) => {
          if (organizationMembershipStatus.status === 'SUCCESS') {
            this.organization.memberEmails.push(administratorEmail);
          }
          this.loadingService.onLoadingFinished();
        });
  }

  doAddMemberToAdministrators(memberEmail: string) {
    this.loadingService.onLoadingStart();
    this.organizationService.addMemberAsAdministrator(this.organization.id, memberEmail)
        .subscribe((organization) => {
          this.organization = organization;
          this.loadingService.onLoadingFinished();
        });
  }

  doRemoveOrganizationAdministrator(administratorEmail: string) {
    this.loadingService.onLoadingStart();
    this.organizationService.removeOrganizationAdministrator(this.organization.id, administratorEmail)
        .subscribe((organization) => {
          this.organization = organization;
          this.loadingService.onLoadingFinished();
        });
  }

  doRemoveOrganizationMember(memberEmail: string) {
    this.loadingService.onLoadingStart();
    this.organizationService.removeOrganizationMember(this.organization.id, memberEmail)
        .subscribe((organization) => {
          this.organization = organization;
          this.loadingService.onLoadingFinished();
        });
  }

  doDeleteOrganization(organization: OrganizationDto) {
    this.organizationService.deleteOrganization(organization.id);
  }
}
