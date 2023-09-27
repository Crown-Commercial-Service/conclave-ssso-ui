import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { BuyerBothRequestsSuccessComponent } from './buyer-both-requests-success.component';

describe('BuyerBothRequestsSuccessComponent', () => {
  let component: BuyerBothRequestsSuccessComponent;
  let fixture: ComponentFixture<BuyerBothRequestsSuccessComponent>;
  let titleService: Title;
  let router: Router;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BuyerBothRequestsSuccessComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: {
              subscribe: (fn: any) =>
                fn({
                  data: btoa(
                    JSON.stringify({
                      status: 'accept',
                      organisationName: 'TestOrg',
                    })
                  ),
                }),
            },
          },
        },
        {
          provide: Router,
          useValue: { navigateByUrl: jest.fn() },
        },
        {
          provide: Title,
          useValue: { setTitle: jest.fn() },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerBothRequestsSuccessComponent);
    component = fixture.componentInstance;
    titleService = TestBed.inject(Title);
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the page title for accept status', () => {
    expect(titleService.setTitle).toHaveBeenCalledWith(
      'Accept right to buy status – success - CCS'
    );
  });

  it('should set the page title for decline status', () => {
    activatedRoute.queryParams.subscribe((para: any) => {
      para.data = btoa(
        JSON.stringify({ status: 'decline', organisationName: 'TestOrg' })
      );
      fixture.detectChanges();
      expect(titleService.setTitle).toHaveBeenCalledWith(
        'Decline right to buy status – success - CCS'
      );
    });
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
    expect(
      fixture.nativeElement.querySelector('.page-title').textContent
    ).toContain(
      'You have accepted the right to buy status for the organisation TestOrg'
    );
  });

  it('should display the correct message for decline status', () => {
    activatedRoute.queryParams.subscribe((para: any) => {
      para.data = btoa(
        JSON.stringify({ status: 'decline', organisationName: 'TestOrg' })
      );
      fixture.detectChanges();
      expect(
        fixture.nativeElement.querySelector('.page-title').textContent
      ).toContain(
        'You have declined the right to buy status for organisation TestOrg'
      );
    });
  });
});
