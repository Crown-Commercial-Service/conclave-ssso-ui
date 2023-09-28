import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmDeclineComponent } from './confirm-decline.component';
import { WrapperBuyerBothService } from 'src/app/services/wrapper/wrapper-buyer-both.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('ConfirmDeclineComponent', () => {
  let component: ConfirmDeclineComponent;
  let fixture: ComponentFixture<ConfirmDeclineComponent>;
  let mockRouter: any;
  let mockWrapperBuyerBothService: any;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockRouter = { navigateByUrl: jest.fn() };
    mockWrapperBuyerBothService = { manualValidation: jest.fn() };
    mockActivatedRoute = {
      queryParams: {
        subscribe: jest.fn((fn: (value: any) => void) => {
          fn({ data: 'someData' });
        }),
      },
    };

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ConfirmDeclineComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        {
          provide: WrapperBuyerBothService,
          useValue: mockWrapperBuyerBothService,
        },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        TranslateService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDeclineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize routeDetails on ngOnInit', () => {
    expect(component.routeDetails).toBeUndefined();
    component.ngOnInit();
    expect(component.routeDetails).toEqual({ data: 'someData' });
  });

  it('should call wrapperBuyerAndBothService.manualValidation and navigate to decline-success on confirmAndDecline', () => {
    component.routeDetails = {
      organisationId: 'orgId',
      organisationName: 'orgName',
    };

    component.confirmAndDecline();

    expect(mockWrapperBuyerBothService.manualValidation).toHaveBeenCalledWith(
      'orgId',
      'decline'
    );
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('decline-success');
  });

  it('should navigate to previous page on Back', () => {
    component.Back();

    expect(window.history.back).toHaveBeenCalled();
  });
});
