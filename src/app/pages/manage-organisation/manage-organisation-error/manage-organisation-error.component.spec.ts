import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Store } from '@ngrx/store';
import { ViewportScroller } from '@angular/common';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { ManageOrganisationErrorComponent } from './manage-organisation-error.component';
import { dataService } from 'src/app/services/data/data.service';
import { UIState } from 'src/app/store/ui.states';
import { of } from 'rxjs';

describe('ManageOrganisationErrorComponent', () => {
  let component: ManageOrganisationErrorComponent;
  let fixture: ComponentFixture<ManageOrganisationErrorComponent>;
  let mockRouter: any;
  let mockActivatedRoute: any;
  let mockLocation: any;
  let mockDataService: any;
  let mockStore: any;

  beforeEach(async () => {
    const viewportScrollerSpy = jasmine.createSpyObj('ViewportScroller', [
      'setOffset',
    ]);
    mockRouter = jasmine.createSpyObj(['navigate']);
    mockActivatedRoute = {
      params: of({ reason: 'wrong' }),
    };
    mockLocation = jasmine.createSpyObj(['back']);
    mockDataService = jasmine.createSpyObj(['']);
    mockStore = jasmine.createSpyObj(['dispatch']);

    await TestBed.configureTestingModule({
      declarations: [ManageOrganisationErrorComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Location, useValue: mockLocation },
        { provide: dataService, useValue: mockDataService },
        { provide: Store, useValue: mockStore },
        { provide: ViewportScroller, useValue: viewportScrollerSpy },
        { provide: ScrollHelper, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrganisationErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the reason property with the value from route params', () => {
    expect(component.reason).toBe('wrong');
  });

  it('should navigate back when goBack() is called', () => {
    component.goBack();
    expect(mockLocation.back).toHaveBeenCalled();
  });
});
