import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { ManageGroupDeleteConfirmComponent } from './manage-group-delete-confirm-component';
import { WrapperOrganisationGroupService } from 'src/app/services/wrapper/wrapper-org--group-service';
import { OrganisationGroupResponseInfo } from 'src/app/models/organisationGroup';
import { SharedDataService } from 'src/app/shared/shared-data.service';
import { TranslateModule } from '@ngx-translate/core';

describe('ManageGroupDeleteConfirmComponent', () => {
  let component: ManageGroupDeleteConfirmComponent;
  let fixture: ComponentFixture<ManageGroupDeleteConfirmComponent>;
  let mockActivatedRoute: any;
  let mockOrgGroupService: WrapperOrganisationGroupService;
  let mockSharedDataService: SharedDataService;
  let mockStore: Store<any>;

  beforeEach(async () => {
    mockActivatedRoute = {
      snapshot: {
        queryParams: {
          data: JSON.stringify({
            isEdit: true,
            groupId: 1,
            organisationId: '12345',
          }),
        },
      },
    };

    mockOrgGroupService = jasmine.createSpyObj(
      'WrapperOrganisationGroupService',
      ['getOrganisationGroup', 'deleteOrganisationGroup']
    );
    mockSharedDataService = jasmine.createSpyObj('SharedDataService', [
      'manageGroupStorage',
    ]);
    mockStore = jasmine.createSpyObj('Store', ['dispatch']);

    await TestBed.configureTestingModule({
      declarations: [ManageGroupDeleteConfirmComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        {
          provide: WrapperOrganisationGroupService,
          useValue: mockOrgGroupService,
        },
        { provide: SharedDataService, useValue: mockSharedDataService },
        { provide: Store, useValue: mockStore },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageGroupDeleteConfirmComponent);
    component = fixture.componentInstance;
    (mockOrgGroupService.getOrganisationGroup as jasmine.Spy).and.returnValue({
      subscribe: () => {},
    });

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component properties correctly', () => {
    expect(component.isEdit).toBe(true);
    expect(component.groupId).toBe(1);
    expect(component.organisationId).toBe('12345');
    expect(component.routeData).toEqual({
      isEdit: true,
      groupId: 1,
      organisationId: '12345',
    });
  });

  it('should fetch organisation group details on component initialization', () => {
    const mockGroup: any = {
      groupName: 'Test Group',
    };
    (mockOrgGroupService.getOrganisationGroup as jasmine.Spy).and.returnValue(
      of(mockGroup)
    );

    component.ngOnInit();

    expect(mockOrgGroupService.getOrganisationGroup).toHaveBeenCalledWith(
      '12345',
      1
    );
    expect(component.GroupDetails).toEqual(mockGroup);
  });
});
