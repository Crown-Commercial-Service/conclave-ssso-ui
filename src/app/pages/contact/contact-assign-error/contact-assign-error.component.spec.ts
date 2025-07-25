import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { ContactAssignErrorComponent } from './contact-assign-error-component';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ContactAssignErrorComponent', () => {
  let component: ContactAssignErrorComponent;
  let fixture: ComponentFixture<ContactAssignErrorComponent>;
  let router: Router;
  let activatedRoute: ActivatedRoute;
  let viewportScroller: ViewportScroller;

  beforeEach(async () => {
    const viewportScrollerSpy = jasmine.createSpyObj('ViewportScroller', [
      'setOffset',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
      ],
      declarations: [ContactAssignErrorComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),  
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParams: { data: '{}' } } },
        },
        {
          provide: Store,
          useFactory: () => ({}),
        },
        { provide: ViewportScroller, useValue: viewportScrollerSpy },
        { provide: ScrollHelper, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactAssignErrorComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
    viewportScroller = TestBed.inject(
      ViewportScroller
    ) as jasmine.SpyObj<ViewportScroller>;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to profile on navigate to profile click', () => {
    spyOn(router, 'navigateByUrl');
    component.onNavigateToProfileClick();
    expect(router.navigateByUrl).toHaveBeenCalledWith(`manage-org/profile`);
  });

  it('should navigate to site edit on navigate to site click', () => {
    spyOn(router, 'navigateByUrl');
    component.assigningSiteId = 123;
    component.onNavigateToSiteClick();
    expect(router.navigateByUrl).toHaveBeenCalledWith(
      'manage-org/profile/site/edit?data={"isEdit":true,"siteId":123}'
    );
  });
});
