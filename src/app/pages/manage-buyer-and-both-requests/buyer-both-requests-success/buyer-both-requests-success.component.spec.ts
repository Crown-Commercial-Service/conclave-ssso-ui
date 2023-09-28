import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BuyerBothRequestsSuccessComponent } from './buyer-both-requests-success.component';

describe('BuyerBothRequestsSuccessComponent', () => {
  let component: BuyerBothRequestsSuccessComponent;
  let fixture: ComponentFixture<BuyerBothRequestsSuccessComponent>;
  let titleService: Title;
  let router: Router;
  let activatedRouteMock: any;

  beforeEach(async () => {
    activatedRouteMock = {
      queryParams: {
        subscribe: jest.fn(),
      },
    };

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [BuyerBothRequestsSuccessComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: activatedRouteMock,
        },
        {
          provide: Router,
          useValue: { navigateByUrl: jest.fn() },
        },
        {
          provide: Title,
          useValue: { setTitle: jest.fn() },
        },
        TranslateService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerBothRequestsSuccessComponent);
    component = fixture.componentInstance;
    titleService = TestBed.inject(Title);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the page title for accept status', () => {
    const mockUserInfo = btoa(
      JSON.stringify({ status: 'accept', organisationName: 'TestOrg' })
    );
    const mockQueryParams = { data: mockUserInfo };

    activatedRouteMock.queryParams.subscribe.mockImplementation(
      (callback: any) => {
        callback(mockQueryParams);
      }
    );

    expect(titleService.setTitle).toHaveBeenCalledWith(
      'Accept right to buy status – success - CCS'
    );
  });

  it('should set the page title for decline status', () => {
    const mockUserInfo = btoa(
      JSON.stringify({ status: 'decline', organisationName: 'TestOrg' })
    );
    const mockQueryParams = { data: mockUserInfo };

    activatedRouteMock.queryParams.subscribe.mockImplementation(
      (callback: any) => {
        callback(mockQueryParams);
      }
    );

    expect(titleService.setTitle).toHaveBeenCalledWith(
      'Decline right to buy status – success - CCS'
    );
  });

  it('should navigate to manage-buyer-both on returnToRequests', () => {
    component.returnToRequests();
    expect(router.navigateByUrl).toHaveBeenCalledWith('manage-buyer-both');
  });

  it('should navigate to home on returnToDashBoard', () => {
    component.returnToDashBoard();
    expect(router.navigateByUrl).toHaveBeenCalledWith('home');
  });

  it('should display the correct message for accept status', () => {
    const mockUserInfo = btoa(
      JSON.stringify({ status: 'accept', organisationName: 'TestOrg' })
    );
    const mockQueryParams = { data: mockUserInfo };

    activatedRouteMock.queryParams.subscribe.mockImplementation(
      (callback: any) => {
        callback(mockQueryParams);
      }
    );

    expect(
      fixture.nativeElement.querySelector('.page-title').textContent
    ).toContain(
      'You have accepted the right to buy status for the organisation TestOrg'
    );
  });

  it('should display the correct message for decline status', () => {
    const mockUserInfo = btoa(
      JSON.stringify({ status: 'decline', organisationName: 'TestOrg' })
    );
    const mockQueryParams = { data: mockUserInfo };

    activatedRouteMock.queryParams.subscribe.mockImplementation(
      (callback: any) => {
        callback(mockQueryParams);
      }
    );

    expect(
      fixture.nativeElement.querySelector('.page-title').textContent
    ).toContain(
      'You have declined the right to buy status for organisation TestOrg'
    );
  });
});
