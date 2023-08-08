import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {OrganizationDto} from '../../dtos/organization/OrganizationDto';
import {EMPTY, Observable} from 'rxjs';
import {OrganizationMembershipStatusDto} from '../../dtos/organization/OrganizationMembershipStatusDto';
import {OrganizationSnippetDto} from '../../dtos/organization/OrganizationSnippetDto';
import {ModalService} from '../modal/modal.service';
import {LoadingService} from '../loading/loading.service';
import {Router} from '@angular/router';
import {RoutePaths} from '../../app-routing.module';

@Injectable({
  providedIn: 'root',
})
export class OrganizationService {
  constructor(private httpClient: HttpClient,
              private modalService: ModalService,
              private loadingService: LoadingService,
              private router: Router) { }

  createOrganization(name: string): Observable<OrganizationDto> {
    return this.httpClient.post<OrganizationDto>(`${environment.MAIN_API_URL}/organizations`, {name});
  }

  getOrganizationById(organizationId: string): Observable<OrganizationDto> {
    return this.httpClient.get<OrganizationDto>(`${environment.MAIN_API_URL}/organizations/${organizationId}`);
  }

  getOrganizationSnippetById(organizationId: string): Observable<OrganizationSnippetDto> {
    return this.httpClient.get<OrganizationSnippetDto>(`${environment.MAIN_API_URL}/organizations/${organizationId}/snippet`);
  }

  addAdministratorAsMember(
      organizationId: string,
      administratorEmail: string,
  ): Observable<OrganizationMembershipStatusDto> {
    return this.httpClient.patch<OrganizationMembershipStatusDto>(`${environment.MAIN_API_URL}/organizations/update-admin-join-as-member/${organizationId}`, {administratorEmailToUpdate: administratorEmail});
  }

  addMemberAsAdministrator(organizationId: string, memberEmail: string): Observable<OrganizationDto> {
    return this.httpClient.patch<OrganizationDto>(`${environment.MAIN_API_URL}/organizations/update-member-join-as-admin/${organizationId}`, {email: memberEmail});
  }

  removeOrganizationAdministrator(organizationId: string, administratorEmail: string): Observable<OrganizationDto> {
    return this.httpClient.patch<OrganizationDto>(`${environment.MAIN_API_URL}/organizations/${organizationId}/administrators/remove`, {administratorEmailToRemove: administratorEmail});
  }

  removeOrganizationMember(organizationId: string, memberEmail: string): Observable<OrganizationDto> {
    return this.httpClient.patch<OrganizationDto>(`${environment.MAIN_API_URL}/organizations/${organizationId}/members/remove`, {memberEmailToRemove: memberEmail});
  }

  getOrganizationsWhereInvolved(): Observable<OrganizationDto[]> {
    return this.httpClient.get<OrganizationDto[]>(`${environment.MAIN_API_URL}/organizations/where-involved`);
  }

  searchOrganizations(searchString: string): Observable<OrganizationSnippetDto[]> {
    if (searchString.length === 0) {
      this.loadingService.onLoadingFinished();
      return EMPTY;
    }
    return this.httpClient.get<OrganizationSnippetDto[]>(`${environment.MAIN_API_URL}/organizations/search/${searchString}`);
  }

  deleteOrganization(organizationId: string) {
    this.modalService.showPopupModal(
        'Delete Organization',
        'Delete',
        'Cancel',
        () => {
          this.loadingService.onLoadingStart();
          this.httpClient.delete<OrganizationDto>(`${environment.MAIN_API_URL}/organizations/${organizationId}`)
              .subscribe((organization) => {
                this.modalService.hidePopupModal();
                this.modalService.showDefaultModal('Organization', `Organization with ID: ${organization.id} successfully deleted`);
                this.loadingService.onLoadingFinished();
                this.router.navigate([`/${RoutePaths.ORGANIZATIONS_MANAGE}`]).catch((reason) => window.alert(reason));
              });
        },
        () => {
          this.loadingService.onLoadingFinished();
          this.modalService.hidePopupModal();
        },
    );
  }
}
