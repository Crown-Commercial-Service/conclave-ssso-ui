import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Params, provideRouter, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ViewportScroller } from '@angular/common';
import { BehaviorSubject, of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { ManageOrganisationRegistryDeleteConfirmationComponent } from './manage-organisation-profile-registry-delete-confirm.component';
import { dataService } from 'src/app/services/data/data.service';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { UIState } from 'src/app/store/ui.states';
import { DataLayerService } from 'src/app/shared/data-layer.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ManageOrganisationRegistryDeleteConfirmationComponent', () => {
  let component: ManageOrganisationRegistryDeleteConfirmationComponent;
  let fixture: ComponentFixture<ManageOrganisationRegistryDeleteConfirmationComponent>;
  let mockDataService: jasmine.SpyObj<dataService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;
  let mockStore: jasmine.SpyObj<Store<UIState>>;
  let mockDataLayerService: jasmine.SpyObj<DataLayerService>;

  beforeEach(async () => {
    mockDataService = jasmine.createSpyObj('DataService', ['']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate','createUrlTree']);
    mockStore = jasmine.createSpyObj('Store', ['dispatch']);
    mockDataLayerService = jasmine.createSpyObj('DataLayerService', ['pushPageViewEvent']);
    // mockActivatedRoute = jasmine.createSpyObj('ActivatedRoute', [], {
    //   snapshot: { paramMap: { get: () => '1' } },
    //   params: of({ scheme: 'test', organisationId: '123', id: '123' }),
    // });
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: () => '1',
        },
      },
      params: of({ scheme: 'test', organisationId: '123', id: '123' }),
    };
    
    const viewportScrollerSpy = jasmine.createSpyObj('ViewportScroller', [
      'setOffset',
    ]);

    await TestBed.configureTestingModule({
      declarations: [ManageOrganisationRegistryDeleteConfirmationComponent],
      imports: [TranslateModule.forRoot(),],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: dataService, useValue: mockDataService },
        // { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Store, useValue: mockStore },
        { provide: ViewportScroller, useValue: viewportScrollerSpy },
        { provide: ScrollHelper, useValue: {} },
        { provide: DataLayerService, useValue: mockDataLayerService },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(
      ManageOrganisationRegistryDeleteConfirmationComponent
    );
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize organisationId and orgId properties', () => {
    expect(component.organisationId).toBe(1);
  });

  it('should display success message', () => {
    const successMessage = fixture.nativeElement.querySelector('.success_msg');
    expect(successMessage.textContent).toContain(
      'You have successfully removed additional registries from your organisation'
    );
  });
});
