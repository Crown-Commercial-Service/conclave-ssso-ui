import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { ManageOrgRegStep1Component } from './manage-organisation-registration-step-1.component';
import { dataService } from 'src/app/services/data/data.service';
import { ViewportScroller } from '@angular/common';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { SharedDataService } from 'src/app/shared/shared-data.service';
import { UIState } from 'src/app/store/ui.states';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
// import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ManageOrgRegStep1Component', () => {
  let component: ManageOrgRegStep1Component;
  let fixture: ComponentFixture<ManageOrgRegStep1Component>;
  let mockDataService: jasmine.SpyObj<dataService>;
  let mockRouter: any;
  let mockStore: jasmine.SpyObj<Store<UIState>>;
  let mockViewportScroller: jasmine.SpyObj<ViewportScroller>;
  let mockScrollHelper: jasmine.SpyObj<ScrollHelper>;
  let mockSharedDataService: jasmine.SpyObj<SharedDataService>;

  beforeEach(async () => {
    mockDataService = jasmine.createSpyObj('dataService', ['']);
    mockRouter = { navigateByUrl: jasmine.createSpy('navigateByUrl') };
    mockStore = jasmine.createSpyObj('Store', ['']);
    mockSharedDataService = jasmine.createSpyObj('SharedDataService', [
      'checkBlockedSchemeText',
    ]);
    const viewportScrollerSpy = jasmine.createSpyObj('ViewportScroller', [
      'setOffset',
    ]);

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ManageOrgRegStep1Component],
      providers: [
        { provide: dataService, useValue: mockDataService },
        { provide: Router, useValue: mockRouter },
        { provide: Store, useValue: mockStore },
        { provide: ViewportScroller, useValue: viewportScrollerSpy },
        { provide: ScrollHelper, useValue: mockScrollHelper },
        { provide: SharedDataService, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrgRegStep1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to "manage-org/register/initial-search" when onClick is called', () => {
    component.onClick();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(
      'manage-org/register/initial-search'
    );
  });
});
