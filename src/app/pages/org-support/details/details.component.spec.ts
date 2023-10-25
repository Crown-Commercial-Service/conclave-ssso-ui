import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { OrgSupportDetailsComponent } from './details.component';
import { WrapperOrganisationGroupService } from 'src/app/services/wrapper/wrapper-org--group-service';
import { WrapperUserService } from 'src/app/services/wrapper/wrapper-user.service';
import { StoreModule } from '@ngrx/store';
import { UIState } from 'src/app/store/ui.states';
import { ViewportScroller } from '@angular/common';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { FormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';

describe('OrgSupportDetailsComponent', () => {
  let component: OrgSupportDetailsComponent;
  let fixture: ComponentFixture<OrgSupportDetailsComponent>;
  let viewportScroller: jasmine.SpyObj<ViewportScroller>;
  let mockActivatedRoute: any;
  let mockWrapperUserService: any;
  let mockWrapperOrganisationGroupService: any;

  beforeEach(async () => {
    const viewportScrollerSpy = jasmine.createSpyObj('ViewportScroller', [
      'setOffset',
    ]);

    mockActivatedRoute = {
      queryParams: of({
        rpwd: 'true',
        rmfa: 'false',
        chrole: 'assign',
      }),
    };

    mockWrapperUserService = {
      getUser: () =>
        of({
          firstName: 'test',
          lastName: 'user',
          userName: 'testuser',
          organisationId: '123',
          mfaEnabled: false,
          isAdminUser: false,
          detail: {
            id: 1,
            canChangePassword: true,
          },
        }),
    };

    mockWrapperOrganisationGroupService = {
      getOrganisationGroups: () =>
        of({
          groupList: [
            { groupId: 1, groupName: 'Group 1' },
            { groupId: 2, groupName: 'Group 2' },
            { groupId: 3, groupName: 'Group 3' },
          ],
        }),
    };

    await TestBed.configureTestingModule({
      declarations: [OrgSupportDetailsComponent],
      imports: [RouterTestingModule, FormsModule, StoreModule.forRoot({})],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: WrapperUserService, useValue: mockWrapperUserService },
        {
          provide: WrapperOrganisationGroupService,
          useValue: mockWrapperOrganisationGroupService,
        },
        { provide: ViewportScroller, useValue: viewportScrollerSpy },
        { provide: ScrollHelper, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgSupportDetailsComponent);
    component = fixture.componentInstance;
    viewportScroller = TestBed.inject(
      ViewportScroller
    ) as jasmine.SpyObj<ViewportScroller>;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set the changeRoleEnabled, resetPasswordEnabled, and resetMfaEnabled based on query params', () => {
    expect(component.changeRoleEnabled).toBe(true);
    expect(component.resetPasswordEnabled).toBe(true);
    expect(component.resetMfaEnabled).toBe(false);
  });

  it('should navigate to the confirm page on continue click', () => {
    const routerSpy = spyOn(component.router, 'navigateByUrl');
    component.onContinueClick();
    expect(routerSpy).toHaveBeenCalledWith(
      'org-support/confirm?rpwd=true&rmfa=false&chrole=assign'
    );
  });

  it('should navigate to the search page on cancel click', () => {
    const routerSpy = spyOn(component.router, 'navigateByUrl');
    component.onCancelClick();
    expect(routerSpy).toHaveBeenCalledWith('org-support/search');
  });
});
