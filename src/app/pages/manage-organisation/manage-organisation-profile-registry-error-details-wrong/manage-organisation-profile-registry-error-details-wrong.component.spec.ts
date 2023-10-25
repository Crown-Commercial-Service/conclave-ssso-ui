import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { ManageOrganisationRegistryDetailsWrongComponent } from './manage-organisation-profile-registry-error-details-wrong.component';
import { dataService } from 'src/app/services/data/data.service';
import { UIState } from 'src/app/store/ui.states';
import { ViewportScroller, Location } from '@angular/common';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';

describe('ManageOrganisationRegistryDetailsWrongComponent', () => {
  let component: ManageOrganisationRegistryDetailsWrongComponent;
  let fixture: ComponentFixture<ManageOrganisationRegistryDetailsWrongComponent>;
  let router: Router;
  let activatedRoute: ActivatedRoute;
  let dataservice: dataService;
  let location: Location;
  let store: Store<UIState>;
  let viewportScroller: ViewportScroller;
  let scrollHelper: ScrollHelper;

  beforeEach(async () => {
    const viewportScrollerSpy = jasmine.createSpyObj('ViewportScroller', [
      'setOffset',
    ]);

    await TestBed.configureTestingModule({
      declarations: [ManageOrganisationRegistryDetailsWrongComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: dataService, useValue: {} },
        { provide: Location, useValue: {} },
        {
          provide: Router,
          useValue: { navigateByUrl: jasmine.createSpy('navigateByUrl') },
        },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '123' } } },
        },
        {
          provide: Store,
          useValue: {
            dispatch: jasmine.createSpy('dispatch'),
            pipe: () => of(),
          },
        },
        { provide: ViewportScroller, useValue: viewportScrollerSpy },
        { provide: ScrollHelper, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(
      ManageOrganisationRegistryDetailsWrongComponent
    );
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
    dataservice = TestBed.inject(dataService);
    location = TestBed.inject(Location);
    store = TestBed.inject(Store);
    viewportScroller = TestBed.inject(ViewportScroller);
    scrollHelper = TestBed.inject(ScrollHelper);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the component', () => {
    expect(component.organisationId).toEqual('123');
  });

  it('should navigate to search page when goToSearch method is called', () => {
    component.goToSearch();
    expect(router.navigateByUrl).toHaveBeenCalledWith(
      `manage-org/profile/123/registry/search`
    );
  });
});
