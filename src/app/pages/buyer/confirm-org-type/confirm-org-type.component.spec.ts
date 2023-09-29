import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmOrgTypeComponent } from './confirm-org-type.component';
import { ActivatedRoute, Router } from '@angular/router';
import { OrganisationService } from 'src/app/services/postgres/organisation.service';
import { WrapperOrganisationService } from 'src/app/services/wrapper/wrapper-org-service';
import { Store } from '@ngrx/store';
import { UIState } from 'src/app/store/ui.states';
import { ViewportScroller } from '@angular/common';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { Observable, of } from 'rxjs';

describe('ConfirmOrgTypeComponent', () => {
  let component: ConfirmOrgTypeComponent;
  let fixture: ComponentFixture<ConfirmOrgTypeComponent>;
  let mockRouter: any;
  let mockActivatedRoute: any;
  let mockOrganisationService: any;
  let mockWrapperOrgService: any;
  let mockStore: any;
  let mockViewportScroller: any;
  let mockScrollHelper: any;

  beforeEach(async () => {
    mockRouter = { navigateByUrl: jest.fn() };
    mockActivatedRoute = { queryParams: of({ data: 'test-data' }) };
    mockOrganisationService = { getById: jest.fn() };
    mockWrapperOrgService = { updateOrgRoles: jest.fn() };
    mockStore = { dispatch: jest.fn() };
    mockViewportScroller = { scrollToPosition: jest.fn() };
    mockScrollHelper = { scrollToElement: jest.fn() };

    await TestBed.configureTestingModule({
      declarations: [ConfirmOrgTypeComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: OrganisationService, useValue: mockOrganisationService },
        {
          provide: WrapperOrganisationService,
          useValue: mockWrapperOrgService,
        },
        { provide: Store, useValue: mockStore },
        { provide: ViewportScroller, useValue: mockViewportScroller },
        { provide: ScrollHelper, useValue: mockScrollHelper },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmOrgTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to the previous page on back click', () => {
    component.onBackClick();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('buyer/search');
  });

  it('should update org roles and navigate to the success page on submit click', async () => {
    const mockModel = {
      orgType: 1,
      rolesToDelete: [],
      rolesToAdd: [],
      rolesToAutoValid: [],
      companyHouseId: 'test-company-house-id',
    };
    const mockOrg = { ciiOrganisationId: 'test-org-id' };

    mockOrganisationService.getById.mockReturnValue(of(mockOrg));
    mockWrapperOrgService.updateOrgRoles.mockResolvedValue(undefined);

    component.changes = {
      orgType: 1,
      toDelete: [],
      toAdd: [],
      toAutoValid: [],
    };
    component.org = mockOrg;
    component.routeData = {
      companyHouseId: 'test-company-house-id',
    };

    await component.onSubmitClick();

    expect(mockWrapperOrgService.updateOrgRoles).toHaveBeenCalledWith(
      mockOrg.ciiOrganisationId,
      JSON.stringify(mockModel),
      'validation/auto/switch'
    );
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(
      `update-org-type/buyer-success/${mockOrg.ciiOrganisationId}`
    );
  });
});
