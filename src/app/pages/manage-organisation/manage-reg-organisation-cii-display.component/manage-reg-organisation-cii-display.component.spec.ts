import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { ViewportScroller } from '@angular/common';
import { OrganisationService } from 'src/app/services/postgres/organisation.service';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { ManageOrgRegCIIOrgDisplayComponent } from './manage-reg-organisation-cii-display.component';
import { UIState } from 'src/app/store/ui.states';
import { of } from 'rxjs';
import { OrganisationSearchDto } from 'src/app/models/organisation';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ManageOrgRegCIIOrgDisplayComponent', () => {
  let component: ManageOrgRegCIIOrgDisplayComponent;
  let fixture: ComponentFixture<ManageOrgRegCIIOrgDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageOrgRegCIIOrgDisplayComponent],
      imports: [
        RouterTestingModule,
        StoreModule.forRoot({}),
        HttpClientTestingModule,
      ],
      providers: [OrganisationService, ViewportScroller, ScrollHelper],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrgRegCIIOrgDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set orgNotExists to true if data length is 0', async () => {
    spyOn(component['organisationService'], 'getByName').and.returnValue(
      of([] as OrganisationSearchDto[])
    );
    await component.ngOnInit();
    expect(component.orgNotExists).toBeTrue();
  });

  it('should set singleOrgExists to true if data length is 1', async () => {
    spyOn(component['organisationService'], 'getByName').and.returnValue(
      of([{}] as OrganisationSearchDto[])
    );
    await component.ngOnInit();
    expect(component.singleOrgExists).toBeTrue();
  });

  it('should set multipleOrgExists to true if data length is greater than 1', async () => {
    spyOn(component['organisationService'], 'getByName').and.returnValue(
      of([
        {
          organisationId: '123',
          ciiOrganisationId: '123',
          organisationUri: 'sample url',
          legalName: 'name',
        },
        {
          organisationId: '234',
          ciiOrganisationId: '234',
          organisationUri: 'other url',
          legalName: 'name1',
        },
      ] as OrganisationSearchDto[])
    );
    await component.ngOnInit();
    expect(component.multipleOrgExists).toBeTrue();
  });

  it('should navigate to "manage-org/register/newreg" on onContinueNotRegistered()', () => {
    spyOn(component['router'], 'navigateByUrl');
    component.onContinueNotRegistered();
    expect(component['router'].navigateByUrl).toHaveBeenCalledWith(
      'manage-org/register/newreg'
    );
  });

  it('should navigate to "manage-org/register/initial-search" on goBack()', () => {
    spyOn(component['router'], 'navigateByUrl');
    component.goBack();
    expect(component['router'].navigateByUrl).toHaveBeenCalledWith(
      'manage-org/register/initial-search'
    );
  });
});
