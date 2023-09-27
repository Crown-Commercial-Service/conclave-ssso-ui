import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmDeclineComponent } from './confirm-decline.component';
import { WrapperBuyerBothService } from 'src/app/services/wrapper/wrapper-buyer-both.service';
import { of, throwError } from 'rxjs';

describe('ConfirmDeclineComponent', () => {
  let component: ConfirmDeclineComponent;
  let fixture: ComponentFixture<ConfirmDeclineComponent>;
  let mockRouter: jest.Mocked<Router>;
  let mockWrapperBuyerAndBothService: jest.Mocked<WrapperBuyerBothService>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockRouter = {
      navigateByUrl: jest.fn(),
    };

    mockWrapperBuyerAndBothService = {
      manualValidation: jest.fn(),
    };

    mockActivatedRoute = {
      queryParams: of({ data: 'encoded_data' }),
    };

    await TestBed.configureTestingModule({
      declarations: [ConfirmDeclineComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        {
          provide: WrapperBuyerBothService,
          useValue: mockWrapperBuyerAndBothService,
        },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
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

  it('should decode route details from query params', () => {
    component.ngOnInit();
    expect(component.routeDetails).toEqual({
      organisationId: 'decoded_org_id',
      organisationName: 'org_name',
    });
  });

  it('should call manualValidation on confirmAndDecline', () => {
    component.routeDetails = { organisationId: 'org_id' };
    component.confirmAndDecline();
    expect(
      mockWrapperBuyerAndBothService.manualValidation
    ).toHaveBeenCalledWith('org_id', 'decline');
  });

  it('should navigate to "decline-success" on successful manual validation', () => {
    mockWrapperBuyerAndBothService.manualValidation.mockReturnValue(of({}));
    component.confirmAndDecline();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('decline-success');
  });

  it('should navigate to "buyer-and-both-fail" on error during manual validation', () => {
    mockWrapperBuyerAndBothService.manualValidation.mockReturnValue(
      throwError('error')
    );
    component.confirmAndDecline();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(
      'buyer-and-both-fail'
    );
  });

  it('should navigate back on Back', () => {
    jest.spyOn(window.history, 'back');
    component.Back();
    expect(window.history.back).toHaveBeenCalled();
  });
});
