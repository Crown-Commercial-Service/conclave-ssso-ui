import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RemoveRightToBuyComponent } from './remove-right-to-buy.component';
import { WrapperBuyerBothService } from 'src/app/services/wrapper/wrapper-buyer-both.service';
import { of, throwError } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('RemoveRightToBuyComponent', () => {
  let component: RemoveRightToBuyComponent;
  let fixture: ComponentFixture<RemoveRightToBuyComponent>;
  let routerSpy: jest.Mocked<Router>;
  let activatedRouteSpy: jest.Mocked<ActivatedRoute>;
  let wrapperBuyerAndBothServiceSpy: jest.Mocked<WrapperBuyerBothService>;

  beforeEach(async () => {
    const routerSpyObj = {
      navigateByUrl: jest.fn(),
    };

    const activatedRouteSpyObj = {
      queryParams: of({ data: 'eyJvcmdOYW1lIjogIkFyZSBkYXRhIn0=' }),
    };

    const wrapperBuyerAndBothServiceSpyObj = {
      manualValidation: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [RemoveRightToBuyComponent],
      providers: [
        { provide: Router, useValue: routerSpyObj },
        { provide: ActivatedRoute, useValue: activatedRouteSpyObj },
        {
          provide: WrapperBuyerBothService,
          useValue: wrapperBuyerAndBothServiceSpyObj,
        },
        TranslateService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveRightToBuyComponent);
    component = fixture.componentInstance;
    routerSpy = TestBed.inject(Router) as jest.Mocked<Router>;
    activatedRouteSpy = TestBed.inject(
      ActivatedRoute
    ) as jest.Mocked<ActivatedRoute>;
    wrapperBuyerAndBothServiceSpy = TestBed.inject(
      WrapperBuyerBothService
    ) as jest.Mocked<WrapperBuyerBothService>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should parse route query params and assign to routeDetails', () => {
      const mockParams = { data: 'eyJvcmdOYW1lIjogIkFyZSBkYXRhIn0=' }; // base64 encoded JSON object
      activatedRouteSpy.queryParams = of(mockParams);
      component.ngOnInit();
      expect(component.routeDetails).toEqual({ orgName: 'Are data' });
    });
  });

  describe('Back', () => {
    it('should go back in history', () => {
      jest.spyOn(window.history, 'back');
      component.Back();
      expect(window.history.back).toHaveBeenCalled();
    });
  });

  describe('confirm', () => {
    it('should call manualValidation with the correct parameters and navigate to success page on success', () => {
      const mockResponse = { success: true };
      wrapperBuyerAndBothServiceSpy.manualValidation.mockReturnValue(
        of(mockResponse)
      );
      const mockRouteDetails = { id: '123', orgName: 'Test Organization' };
      component.routeDetails = mockRouteDetails;
      component.confirm();
      expect(
        wrapperBuyerAndBothServiceSpy.manualValidation
      ).toHaveBeenCalledWith('123', 2);
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
        'remove-right-to-buy-success?data=eyJzdGF0dXMiOiAicmVtb3ZlIiwgIm9yZ05hbWUiOiAiVGVzdCBPcmdhbml6YXRpb24ifQ=='
      );
    });

    it('should navigate to failure page on error', () => {
      wrapperBuyerAndBothServiceSpy.manualValidation.mockReturnValue(
        throwError('Error occurred')
      );
      component.confirm();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
        'buyer-and-both-fail'
      );
    });
  });
});
