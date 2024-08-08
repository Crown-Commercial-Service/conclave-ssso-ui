import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { ConfirmAcceptComponent } from './confirm-accept.component';
import { WrapperBuyerBothService } from 'src/app/services/wrapper/wrapper-buyer-both.service';
import { TranslateModule } from '@ngx-translate/core';

describe('ConfirmAcceptComponent', () => {
  let component: ConfirmAcceptComponent;
  let fixture: ComponentFixture<ConfirmAcceptComponent>;
  let activatedRoute: ActivatedRoute;
  let router: Router;
  let wrapperBuyerAndBothService: WrapperBuyerBothService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ConfirmAcceptComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({
              data: 'eyJvcmciOiAiMTIzNDU2Nzg5MCIsICJvcmduYW1lTmFtZSI6ICJKb2huIERvZSJ9',
            }),
          },
        },
        {
          provide: Router,
          useValue: {
            navigateByUrl: jasmine.createSpy('navigateByUrl'),
          },
        },
        {
          provide: WrapperBuyerBothService,
          useValue: {
            manualValidation: jasmine
              .createSpy('manualValidation')
              .and.returnValue(of({})),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmAcceptComponent);
    component = fixture.componentInstance;
    activatedRoute = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);
    wrapperBuyerAndBothService = TestBed.inject(WrapperBuyerBothService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate back in history when Back method is called', () => {
    spyOn(window.history, 'back');

    component.Back('Cancel');

    expect(window.history.back).toHaveBeenCalled();
  });
});
