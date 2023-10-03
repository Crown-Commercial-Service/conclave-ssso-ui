import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { ViewPendingVerificationComponent } from './view-pending-verification.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

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
      navigateByUrl: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [ViewPendingVerificationComponent],
      imports: [TranslateModule.forRoot(), HttpClientTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: Router, useValue: routerMock },
        TranslateService,
      ],
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
    component.goBack();
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('manage-buyer-both');
  });
});
