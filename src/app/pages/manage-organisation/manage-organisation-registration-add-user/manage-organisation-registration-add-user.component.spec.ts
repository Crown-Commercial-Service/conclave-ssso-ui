import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ManageOrgRegAddUserComponent } from './manage-organisation-registration-add-user.component';
import { OrganisationService } from 'src/app/services/postgres/organisation.service';
import { PatternService } from 'src/app/shared/pattern.service';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ManageOrgRegAddUserComponent', () => {
  let component: ManageOrgRegAddUserComponent;
  let fixture: ComponentFixture<ManageOrgRegAddUserComponent>;
  let mockOrganisationService: jasmine.SpyObj<OrganisationService>;
  // let mockPatternService: jasmine.SpyObj<PatternService>;
  let mockPatternService: Partial<PatternService>;

  beforeEach(async () => {
    mockOrganisationService = jasmine.createSpyObj('OrganisationService', [
      'registerOrganisation',
    ]);
    // mockPatternService = jasmine.createSpyObj('PatternService', [
    //   'NameValidator',
    //   'emailPattern',
    // ]);

    mockPatternService = {
      NameValidator: "^[a-zA-Z][a-z A-Z,.'-]*(?:\s+[a-zA-Z]+)?$",
      emailPattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    };
    
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        TranslateModule.forRoot(),
      ],
      declarations: [ManageOrgRegAddUserComponent],
      providers: [
        provideRouter([]),
        { provide: OrganisationService, useValue: mockOrganisationService },
        { provide: PatternService, useValue: mockPatternService },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ data: null }),
          },
        },
        { provide: Store, useFactory: () => ({}) },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrgRegAddUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {    
    TestBed.resetTestingModule();
    localStorage.clear(); 
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    const form = component.formGroup;
    expect(form).toBeDefined();    
    expect(component.formGroup.controls['firstName'].value?? '').toBe('');
    expect(component.formGroup.controls['lastName'].value?? '').toBe('');
    expect(component.formGroup.controls['email'].value?? '').toBe('');
  });

  it('should set the pageAccessMode to null if query param data is not provided', () => {
    expect(component.pageAccessMode).toBeNull();
  });

  it('should set the buyerFlow to the value stored in localStorage', () => {
    localStorage.setItem('organisation_type', 'buyer');
    fixture = TestBed.createComponent(ManageOrgRegAddUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.buyerFlow).toBe('buyer');
  });

  it('should call the onSubmit method when the form is submitted', () => {
    spyOn(component, 'onSubmit');
    const form = component.formGroup;

    const submitButton = fixture.nativeElement.querySelector(
      'button[type="submit"]'
    );
    submitButton.click();
    fixture.detectChanges();

    expect(component.onSubmit).toHaveBeenCalledWith(form);
  });
});
