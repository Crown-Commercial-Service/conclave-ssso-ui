import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { OrganisationService } from 'src/app/services/postgres/organisation.service';
import { WrapperOrganisationService } from 'src/app/services/wrapper/wrapper-org-service';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { RouterTestingModule } from '@angular/router/testing';
import { SuccessOrgServiceComponent } from './success-org-service.component';

describe('SuccessOrgServiceComponent', () => {
  let component: SuccessOrgServiceComponent;
  let fixture: ComponentFixture<SuccessOrgServiceComponent>;

  beforeEach(() => {
    const changeDetectorRefStub = () => ({});
    const storeStub = () => ({});
    const activatedRouteStub = () => ({ params: { subscribe: (f: any) => f({}) } });
    const routerStub = () => ({ navigateByUrl: (string: any) => ({}) });
    const organisationServiceStub = () => ({
      getById: (id: any) => ({ pipe: () => ({}) })
    });
    const wrapperOrganisationServiceStub = () => ({});
    const scrollHelperStub = () => ({});
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [SuccessOrgServiceComponent],
      providers: [
        { provide: ChangeDetectorRef, useFactory: changeDetectorRefStub },
        { provide: Store, useFactory: storeStub },
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: Router, useFactory: routerStub },
        { provide: OrganisationService, useFactory: organisationServiceStub },
        {
          provide: WrapperOrganisationService,
          useFactory: wrapperOrganisationServiceStub
        },
        { provide: ScrollHelper, useFactory: scrollHelperStub }
      ]
    });
    fixture = TestBed.createComponent(SuccessOrgServiceComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`toAdd has default value`, () => {
    expect(component.toAdd).toEqual([]);
  });

  it(`toAutoValid has default value`, () => {
    expect(component.toAutoValid).toEqual([]);
  });

  it(`toDelete has default value`, () => {
    expect(component.toDelete).toEqual([]);
  });

  it(`userServiceTableHeaders has default value`, () => {
    expect(component.userServiceTableHeaders).toEqual([`NAME`]);
  });

  it(`userServiceColumnsToDisplay has default value`, () => {
    expect(component.userServiceColumnsToDisplay).toEqual([`accessRoleName`]);
  });
});
