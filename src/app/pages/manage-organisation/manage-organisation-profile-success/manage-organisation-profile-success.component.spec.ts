import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { ManageOrganisationProfileSuccessComponent } from './manage-organisation-profile-success.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('ManageOrganisationProfileSuccessComponent', () => {
  let component: ManageOrganisationProfileSuccessComponent;
  let fixture: ComponentFixture<ManageOrganisationProfileSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
      ],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
      declarations: [ManageOrganisationProfileSuccessComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(
      ManageOrganisationProfileSuccessComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the success message', () => {
    const successMessage = fixture.nativeElement.querySelector('.govuk-body-l');
    expect(successMessage.textContent).toContain(
      'Your changes have been saved'
    );
  });
});
