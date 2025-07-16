import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { AutoValidationBuyerSuccessComponent } from './auto-validation-buyer-success.component';
import { OrganisationService } from 'src/app/services/postgres/organisation.service';
import { WrapperOrganisationService } from 'src/app/services/wrapper/wrapper-org-service';
import { Store } from '@ngrx/store';
import { UIState } from 'src/app/store/ui.states';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { ViewportScroller } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AutoValidationBuyerSuccessComponent', () => {
  let component: AutoValidationBuyerSuccessComponent;
  let fixture: ComponentFixture<AutoValidationBuyerSuccessComponent>;
  let mockOrganisationService: jasmine.SpyObj<OrganisationService>;
  let mockWrapperOrgService: jasmine.SpyObj<WrapperOrganisationService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;
  let mockStore: jasmine.SpyObj<Store<UIState>>;
  let mockScrollHelper: jasmine.SpyObj<ScrollHelper>;

  beforeEach(async () => {
    mockOrganisationService = jasmine.createSpyObj('OrganisationService', [
      'getById',
    ]);
    mockWrapperOrgService = jasmine.createSpyObj(
      'WrapperOrganisationService',
      [],
      ['orgType']
    );
    mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);
    mockActivatedRoute = {
      params: of({ id: '123' }),
    };
    mockStore = jasmine.createSpyObj('Store', ['dispatch']);
    mockScrollHelper = jasmine.createSpyObj('ScrollHelper', ['scrollToTop']);

    await TestBed.configureTestingModule({
      declarations: [AutoValidationBuyerSuccessComponent],
      imports: [],
      providers: [
        provideRouter([]),
        { provide: OrganisationService, useValue: mockOrganisationService },
        {
          provide: WrapperOrganisationService,
          useValue: mockWrapperOrgService,
        },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Store, useValue: mockStore },
        { provide: ScrollHelper, useValue: mockScrollHelper },
        ViewportScroller,
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoValidationBuyerSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
