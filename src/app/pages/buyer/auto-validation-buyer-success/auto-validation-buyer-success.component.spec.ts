import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AutoValidationBuyerSuccessComponent } from './auto-validation-buyer-success.component';
import { OrganisationService } from 'src/app/services/postgres/organisation.service';
import { WrapperOrganisationService } from 'src/app/services/wrapper/wrapper-org-service';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { UIState } from 'src/app/store/ui.states';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { of } from 'rxjs';

describe('AutoValidationBuyerSuccessComponent', () => {
  let component: AutoValidationBuyerSuccessComponent;
  let fixture: ComponentFixture<AutoValidationBuyerSuccessComponent>;
  let mockOrganisationService: any;
  let mockWrapperOrgService: Partial<WrapperOrganisationService>;
  let mockRouter: Partial<Router>;
  let mockActivatedRoute: Partial<ActivatedRoute>;
  let mockUiStore: Partial<Store<UIState>>;
  let mockScrollHelper: Partial<ScrollHelper>;

  beforeEach(async () => {
    mockOrganisationService = {
      getById: jest.fn(),
    };
    mockWrapperOrgService = {};
    mockRouter = {
      navigateByUrl: jest.fn(),
    };
    mockActivatedRoute = {
      params: of({ id: '123' }),
    };
    mockUiStore = {};
    mockScrollHelper = {};

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AutoValidationBuyerSuccessComponent],
      providers: [
        { provide: OrganisationService, useValue: mockOrganisationService },
        {
          provide: WrapperOrganisationService,
          useValue: mockWrapperOrgService,
        },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Store, useValue: mockUiStore },
        { provide: ScrollHelper, useValue: mockScrollHelper },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoValidationBuyerSuccessComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should fetch the organization details and set the org property', () => {
      const mockOrg = { ciiOrganisationId: '123', name: 'Org 1' };
      mockOrganisationService.getById.mockReturnValue(of(mockOrg));

      expect(mockOrganisationService.getById).toHaveBeenCalledWith('123');
      expect(component.org).toEqual(mockOrg);
    });

    it('should navigate to home page if organization details are not found', () => {
      mockOrganisationService.getById.mockReturnValue(of(null));

      expect(mockOrganisationService.getById).toHaveBeenCalledWith('123');
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('home');
    });
  });

  describe('onBackClick', () => {
    it('should navigate to the update-org-type page with the correct organization id', () => {
      component.org = { ciiOrganisationId: '123', name: 'Org 1' };

      component.onBackClick();

      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(
        'update-org-type/confirm/123'
      );
    });
  });
});
