import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { ViewPendingVerificationComponent } from './view-pending-verification.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('ViewPendingVerificationComponent', () => {
  let component: ViewPendingVerificationComponent;
  let fixture: ComponentFixture<ViewPendingVerificationComponent>;
  let activatedRouteMock: any;
  let routerMock: any;

  beforeEach(async () => {
    activatedRouteMock = {
      queryParams: of({ data: 'mockData' }),
    };

    routerMock = {
      navigateByUrl: jasmine.createSpy(),
    };

    await TestBed.configureTestingModule({
      declarations: [ViewPendingVerificationComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: Router, useValue: routerMock },
        TranslateService,
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPendingVerificationComponent);
    component = fixture.componentInstance;
    component.routeDetails = { dateOfRegistration: new Date().toString() };
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to manage-buyer-both when goBack is called and lastRoute is "view-verified"', () => {
    component.lastRoute = 'view-verified';
    component.goBack('Cancel');
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('manage-buyer-both');
  });
});