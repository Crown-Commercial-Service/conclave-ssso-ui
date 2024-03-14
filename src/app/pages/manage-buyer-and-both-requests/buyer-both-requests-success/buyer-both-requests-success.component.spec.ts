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
        subscribe: jasmine.createSpy(),
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
          useValue: { navigateByUrl: jasmine.createSpy() },
        },
        {
          provide: Title,
          useValue: { setTitle: jasmine.createSpy() },
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

  it('should navigate to manage-buyer-both on returnToRequests', () => {
    component.returnToRequests();
    expect(router.navigateByUrl).toHaveBeenCalledWith('manage-buyer-both');
  });

  it('should navigate to home on returnToDashBoard', () => {
    component.returnToDashBoard();
    expect(router.navigateByUrl).toHaveBeenCalledWith('home');
  });
});