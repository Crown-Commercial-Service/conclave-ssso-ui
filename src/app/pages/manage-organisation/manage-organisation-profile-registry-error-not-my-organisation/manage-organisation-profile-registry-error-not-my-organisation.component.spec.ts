import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { ManageOrganisationRegistryOrgNotFoundComponent } from './manage-organisation-profile-registry-error-not-my-organisation.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ManageOrganisationRegistryOrgNotFoundComponent', () => {
  let component: ManageOrganisationRegistryOrgNotFoundComponent;
  let fixture: ComponentFixture<ManageOrganisationRegistryOrgNotFoundComponent>;
  let mockRouter: any;
  let mockActivatedRoute;
  let mockStore;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: () => '123',
        },
      },
      params: of({ organisationId: '123' }) 
    };
    mockStore = jasmine.createSpyObj('Store', ['dispatch']);

    await TestBed.configureTestingModule({
      imports: [],
      declarations: [ManageOrganisationRegistryOrgNotFoundComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Store, useValue: mockStore },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(
      ManageOrganisationRegistryOrgNotFoundComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the organization ID', () => {
    expect(component.organisationId).toEqual('123');
  });
});
