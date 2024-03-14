import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmDeclineComponent } from './confirm-decline.component';
import { WrapperBuyerBothService } from 'src/app/services/wrapper/wrapper-buyer-both.service';
import { of, throwError } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

describe('ConfirmDeclineComponent', () => {
  let component: ConfirmDeclineComponent;
  let fixture: ComponentFixture<ConfirmDeclineComponent>;
  let mockRouter: any;
  let mockWrapperService: any;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);
    mockWrapperService = jasmine.createSpyObj('WrapperBuyerBothService', [
      'manualValidation',
    ]);

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ConfirmDeclineComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({
              data: 'eyJvcmciOiAiMTIzNDU2Nzg5MCIsICJvcmduYW1lTmFtZSI6ICJKb2huIERvZSJ9',
            }),
          },
        },
        { provide: Router, useValue: mockRouter },
        { provide: WrapperBuyerBothService, useValue: mockWrapperService },
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

  it('should initialize routeDetails when queryParams are received', () => {
    const mockRouteDetails = {
      organisationId: '123',
      organisationName: 'Test Org',
    };
    spyOn(JSON, 'parse').and.returnValue(mockRouteDetails);

    component.ngOnInit();

    expect(component.routeDetails).toEqual(mockRouteDetails);
  });

  it('should call manualValidation method and navigate to decline-success on confirmAndDecline', () => {
    const mockResponse = { success: true };
    mockWrapperService.manualValidation.and.returnValue(of(mockResponse));

    component.routeDetails = {
      organisationId: '123',
      organisationName: 'Test Org',
    };
    component.confirmAndDecline();

    expect(mockWrapperService.manualValidation).toHaveBeenCalledWith('123', 1);
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('decline-success');
  });

  it('should navigate to buyer-and-both-fail on error in manualValidation', () => {
    const mockError = { message: 'Error' };
    mockWrapperService.manualValidation.and.returnValue(throwError(mockError));

    component.routeDetails = {
      organisationId: '123',
      organisationName: 'Test Org',
    };
    component.confirmAndDecline();

    expect(mockWrapperService.manualValidation).toHaveBeenCalledWith('123', 1);
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(
      'buyer-and-both-fail'
    );
  });

  it('should navigate back on Back method call', () => {
    spyOn(window.history, 'back');

    component.Back();

    expect(window.history.back).toHaveBeenCalled();
  });
});
