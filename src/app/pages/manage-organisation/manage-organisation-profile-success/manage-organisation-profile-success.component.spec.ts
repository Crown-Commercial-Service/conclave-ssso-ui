import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { ManageOrganisationProfileSuccessComponent } from './manage-organisation-profile-success.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ManageOrganisationProfileSuccessComponent', () => {
  let component: ManageOrganisationProfileSuccessComponent;
  let fixture: ComponentFixture<ManageOrganisationProfileSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        StoreModule.forRoot({}),
        HttpClientTestingModule,
      ],
      declarations: [ManageOrganisationProfileSuccessComponent],
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
