import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ManageOrgRegAddUserComponent } from './manage-organisation-registration-add-user.component';
import { OrganisationService } from 'src/app/services/postgres/organisation.service';
import { PatternService } from 'src/app/shared/pattern.service';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

describe('ManageOrgRegAddUserComponent', () => {
  let component: ManageOrgRegAddUserComponent;
  let fixture: ComponentFixture<ManageOrgRegAddUserComponent>;
  let mockOrganisationService: jasmine.SpyObj<OrganisationService>;
  let mockPatternService: jasmine.SpyObj<PatternService>;

  beforeEach(async () => {
    mockOrganisationService = jasmine.createSpyObj('OrganisationService', [
      'registerOrganisation',
    ]);
    mockPatternService = jasmine.createSpyObj('PatternService', [
      'NameValidator',
      'emailPattern',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
      ],
      declarations: [ManageOrgRegAddUserComponent],
      providers: [
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
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrgRegAddUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    expect(component.formGroup.controls['firstName'].value).toBe('');
    expect(component.formGroup.controls['lastName'].value).toBe('');
    expect(component.formGroup.controls['email'].value).toBe('');
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
