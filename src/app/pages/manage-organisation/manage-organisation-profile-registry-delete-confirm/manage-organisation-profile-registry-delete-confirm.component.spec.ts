import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ViewportScroller } from '@angular/common';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { ManageOrganisationRegistryDeleteConfirmationComponent } from './manage-organisation-profile-registry-delete-confirm.component';
import { dataService } from 'src/app/services/data/data.service';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { UIState } from 'src/app/store/ui.states';

describe('ManageOrganisationRegistryDeleteConfirmationComponent', () => {
  let component: ManageOrganisationRegistryDeleteConfirmationComponent;
  let fixture: ComponentFixture<ManageOrganisationRegistryDeleteConfirmationComponent>;
  let mockDataService: jasmine.SpyObj<dataService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;
  let mockStore: jasmine.SpyObj<Store<UIState>>;

  beforeEach(async () => {
    mockDataService = jasmine.createSpyObj('DataService', ['']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockActivatedRoute = jasmine.createSpyObj('ActivatedRoute', [], {
      snapshot: { paramMap: { get: () => '1' } },
      params: of({ scheme: 'test' }),
    });
    mockStore = jasmine.createSpyObj('Store', ['dispatch']);
    const viewportScrollerSpy = jasmine.createSpyObj('ViewportScroller', [
      'setOffset',
    ]);

    await TestBed.configureTestingModule({
      declarations: [ManageOrganisationRegistryDeleteConfirmationComponent],
      imports: [TranslateModule.forRoot(), RouterTestingModule],
      providers: [
        { provide: dataService, useValue: mockDataService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Store, useValue: mockStore },
        { provide: ViewportScroller, useValue: viewportScrollerSpy },
        { provide: ScrollHelper, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(
      ManageOrganisationRegistryDeleteConfirmationComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize organisationId and orgId properties', () => {
    expect(component.organisationId).toBe(1);
  });

  it('should display success message', () => {
    const successMessage = fixture.nativeElement.querySelector('.success_msg');
    expect(successMessage.textContent).toContain(
      'You have successfully removed additional registries from your organisation'
    );
  });
});
