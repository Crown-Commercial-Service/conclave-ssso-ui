import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { ConfirmAcceptComponent } from './confirm-accept.component';
import { WrapperBuyerBothService } from 'src/app/services/wrapper/wrapper-buyer-both.service';

describe('ConfirmAcceptComponent', () => {
  let component: ConfirmAcceptComponent;
  let fixture: ComponentFixture<ConfirmAcceptComponent>;
  let routerSpy: jest.Mocked<Router>;
  let wrapperBuyerBothServiceSpy: jest.Mocked<WrapperBuyerBothService>;

  beforeEach(async () => {
    const routerSpyObj = {
      navigateByUrl: jest.fn(),
    };

    const wrapperBuyerBothServiceSpyObj = {
      manualValidation: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [ConfirmAcceptComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { queryParams: of({ data: 'encodedData' }) },
        },
        { provide: Router, useValue: routerSpyObj },
        {
          provide: WrapperBuyerBothService,
          useValue: wrapperBuyerBothServiceSpyObj,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmAcceptComponent);
    component = fixture.componentInstance;
    routerSpy = TestBed.inject(Router) as jest.Mocked<Router>;
    wrapperBuyerBothServiceSpy = TestBed.inject(
      WrapperBuyerBothService
    ) as jest.Mocked<WrapperBuyerBothService>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize routeDetails on ngOnInit', () => {
    const mockRouteParams = { data: 'encodedData' };
    component.ngOnInit();
    expect(component.routeDetails).toEqual(
      JSON.parse(atob(mockRouteParams.data))
    );
  });

  it('should call manualValidation and navigate on confirm', () => {
    const mockRouteDetails = {
      organisationId: 'orgId',
      organisationName: 'orgName',
    };
    component.routeDetails = mockRouteDetails;
    wrapperBuyerBothServiceSpy.manualValidation.mockReturnValue(of({}));
    component.confirm();
    expect(wrapperBuyerBothServiceSpy.manualValidation).toHaveBeenCalledWith(
      mockRouteDetails.organisationId,
      0
    );
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
      'buyer-and-both-success'
    );
  });

  it('should navigate on Back', () => {
    component.Back();
    expect(window.history.back).toHaveBeenCalled();
  });

  it('should render the template correctly', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.govuk-heading-xl').textContent).toContain(
      'Confirm you want to accept right to buy status'
    );
    expect(
      compiled.querySelector('.govuk-button--primary').textContent
    ).toContain('Approve');
    expect(
      compiled.querySelector('.govuk-button--secondary').textContent
    ).toContain('Cancel');
  });
});
