import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { Store } from '@ngrx/store';
import { ReactiveFormsModule } from '@angular/forms';
import { ContactAssignUserSearchComponent } from './contact-assign-user-search-component';
import { TranslateModule } from '@ngx-translate/core';
import { WrapperOrganisationService } from 'src/app/services/wrapper/wrapper-org-service';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SearchBoxComponent } from 'src/app/components/search-box/search-box.component';
import { CustomGovukTableComponent } from 'src/app/components/custom-govuk-table/custom-govuk-table.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('ContactAssignUserSearchComponent', () => {
  let component: ContactAssignUserSearchComponent;
  let fixture: ComponentFixture<ContactAssignUserSearchComponent>;
  let router: Router;
  let activatedRoute: ActivatedRoute;
  let wrapperOrganisationService: WrapperOrganisationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        TranslateModule.forRoot(),
      ],
      declarations: [ContactAssignUserSearchComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),  
        { provide: Store, useFactory: () => ({}) },
        { provide: WrapperOrganisationService, useClass: MockWrapperOrganisationService },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactAssignUserSearchComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
    wrapperOrganisationService = TestBed.inject(WrapperOrganisationService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should get organisation users on ngOnInit', () => {
    spyOn(wrapperOrganisationService, 'getUsers').and.returnValue(of({}));
    component.ngOnInit();
    expect(wrapperOrganisationService.getUsers).toHaveBeenCalledOnceWith(
      component.organisationId,
      component.searchingUserName,
      component.currentPage,
      component.pageSize,
      true
    );
  });

  it('should search for users on onSearchClick', () => {
    spyOn(component, 'getOrganisationUsers');
    component.onSearchClick();
    expect(component.getOrganisationUsers).toHaveBeenCalledOnceWith();
  });

  it('should set page and get organisation users on setPage', () => {
    spyOn(component, 'getOrganisationUsers');
    const pageNumber = 2;
    component.setPage(pageNumber);
    expect(component.currentPage).toEqual(pageNumber);
    expect(component.getOrganisationUsers).toHaveBeenCalledOnceWith();
  });


  it('should navigate to contact-assign on onContinue', () => {
    spyOn(router, 'navigateByUrl');
    component.selectedUserName = 'testUser';
    component.onContinue('Continue');
    const expectedData = {
      assigningSiteId: component.assigningSiteId,
      assigningOrgId: component.assigningOrgId,
      siteCreate: component.siteCreate,
    };
    expect(router.navigateByUrl).toHaveBeenCalledWith(
      'contact-assign?data=' + JSON.stringify(expectedData)
    );
  });

  it('should navigate to site edit on onNavigateToSiteClick', () => {
    spyOn(router, 'navigateByUrl');
    component.assigningSiteId = 123;
    component.onNavigateToSiteClick();
    const expectedData = {
      isEdit: true,
      siteId: component.assigningSiteId,
    };
    expect(router.navigateByUrl).toHaveBeenCalledWith(
      'manage-org/profile/site/edit?data=' + JSON.stringify(expectedData)
    );
  });

  it('should go back in history on onCancelClick', () => {
    spyOn(window.history, 'back');
    component.onCancelClick('Cancel');
    expect(window.history.back).toHaveBeenCalledOnceWith();
  });
});

class MockWrapperOrganisationService {
  getUsers(
    organisationId: string,
    searchUserName: string,
    currentPage: number,
    pageSize: number,
    flag: boolean
  ) {
    return of({});
  }
}
