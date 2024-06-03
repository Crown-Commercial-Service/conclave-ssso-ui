import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RemoveRightToBuyComponent } from './remove-right-to-buy.component';
import { WrapperBuyerBothService } from 'src/app/services/wrapper/wrapper-buyer-both.service';
import { of, throwError } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('RemoveRightToBuyComponent', () => {
  let component: RemoveRightToBuyComponent;
  let fixture: ComponentFixture<RemoveRightToBuyComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let wrapperBuyerAndBothServiceSpy: jasmine.SpyObj<WrapperBuyerBothService>;

  beforeEach(async () => {
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigateByUrl']);
    const activatedRouteSpyObj = {
      queryParams: of({ data: 'eyJvcmdOYW1lIjogIkFyZSBkYXRhIn0=' }),
    };
    const wrapperBuyerAndBothServiceSpyObj = jasmine.createSpyObj(
      'WrapperBuyerBothService',
      ['manualValidation']
    );

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
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    activatedRouteSpy = TestBed.inject(
      ActivatedRoute
    ) as jasmine.SpyObj<ActivatedRoute>;
    wrapperBuyerAndBothServiceSpy = TestBed.inject(
      WrapperBuyerBothService
    ) as jasmine.SpyObj<WrapperBuyerBothService>;
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
      spyOn(window.history, 'back');
      component.Back('Cancel');
      expect(window.history.back).toHaveBeenCalled();
    });
  });
});
